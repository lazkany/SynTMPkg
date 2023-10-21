import type { Model} from '../language/generated/ast.js';
import { expandToNode as toNode, toString, Generated } from 'langium';

export function generateJava(m: Model): string {
    return toString(generateJavaContent(m));
}

export function generateJavaContent(model:Model): Generated {
    return toNode`
    package generated;

    import java.io.File;
    import java.io.FileWriter;
    import java.io.IOException;
    import java.lang.ProcessBuilder.Redirect;
    import java.util.Arrays;
    import java.util.HashSet;
    import java.util.Set;
    import java.util.concurrent.ExecutionException;
    import java.util.concurrent.TimeoutException;

    import com.syntm.analysis.Partitioning;
    import com.syntm.lts.Mealy;
    import com.syntm.lts.Spec;
    import com.syntm.lts.State;
    import com.syntm.lts.TS;

    public class ${model.name.name} {
        private TS mainTS;
        ${generateMain(model)}
        public void processInput(TS ts, Spec spec) {
            for (String agent : spec.getAgents().keySet()) {
                ts.initialDecomposition(agent, spec.getAgents().get(agent).getChannels(),
                        spec.getAgents().get(agent).getOutput());
            }
    
    
            Set<TS> sTS = new HashSet<TS>();
    
            for (TS pa : ts.getParameters()) {
                Partitioning lp = new Partitioning(pa, ts.getAgentById(pa.getName()));
                sTS.add(lp.computeCompressedTS());
            }
            // Create Dummy TS for compostion (The Id of ||)
            TS t = new TS("");
            State s = new State("in");
            t.addState(s);
            t.setInitState("in");
    
            for (TS tss : sTS) {
    
                t = t.openParallelCompTS(tss);
            }
            t.toDot();
            t = t.prunedTS(t);
            t.toDot();
        }

        public void writeOutput(final String filename) {
            try {
                FileWriter out = new FileWriter(new File(filename));
    
                out.write(this.mainTS.toString());
                out.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
    `;
}


function generateMain(model: Model): Generated {
    let sint : (String | undefined) = "";
    let sinp : (String | undefined)[] = [];
    let sout : (String | undefined)[] = [];
    let ainp : (String | undefined)[] = [];
    let aout : (String | undefined)[] = [];
    let aformula : (String | undefined)[] = [];
    let gformula : (String | undefined)[] = [];
    model.interfc?.sins.ins.forEach(inp => {
        sinp=sinp.concat(inp.name);
    });
    model.interfc?.souts.outs.forEach(out => {
        sout=sout.concat(out.name);
    });
    model.agents.forEach(a => {
        a.ains.ins.forEach(n => {
            ainp = ainp.concat(n.name);
        });
        a.aouts.outs.forEach(n => {
            aout = aout.concat(n.name);
        });
        sint=(a.name+":"+ainp+":"+aout)+";"+sint;
        ainp=[];
        aout=[];
    });
  
        model.agents.forEach(a => {
        aout=aout.concat(a.name+":")
        a.aouts.outs.forEach(n => {
            aout = aout.concat(n.name);
        });
        
    });
        model.Assumptions?.formula.forEach(f => {
        aformula.push(f.$cstNode?.text);
        
    });
        model.Guarantees?.formula.forEach(f => {
        gformula.push(f.$cstNode?.text);
        
    });
    return toNode`
    public static void main(final String[] args)
            throws IOException, InterruptedException, ExecutionException, TimeoutException {
        ${model.name.name} runEngine = new ${model.name.name}();
        Spec spec = new Spec();
        spec.setcCode("${sinp}");
        spec.setoCode("${sout}");
        Set<String> chan = new HashSet<>(Arrays.asList("${sinp}".split(",")));
        Set<String> out = new HashSet<>(Arrays.asList("${sout}".split(",")));
        spec.getsInterface().setChannels(chan);
        spec.getsInterface().setOutput(out);
        spec.agentBuilder("${sint}");
        spec.assumptionBuilder("${aformula}".split(","));
        spec.guaranteeBuilder("${gformula}".split(","));

		String command = spec.toString();
		System.out.println(command);
		ProcessBuilder p = new ProcessBuilder("docker", "run", "lazkany/strix", "-f", command, spec.inParam(),
				spec.outParam(), "--k");

		File Strategy = new File("Mealy");
		p.redirectErrorStream(true);
		p.redirectOutput(Redirect.appendTo(Strategy));
		Process proc = p.start();
		proc.waitFor();

		Mealy m = new Mealy("");
		m.kissToMealy("Mealy", spec.getcCode(), spec.getoCode());		
		if (m.getStatus().equals("REALIZABLE")) {
			m.toDot(m, m.getName());
			TS ts = m.toTS(m, m.getName());
			runEngine.processInput(ts, spec);
		}
		Strategy.delete();
    }    
    `;
}

