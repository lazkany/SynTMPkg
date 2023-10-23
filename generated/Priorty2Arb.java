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

public class Priorty2Arb {
    private TS mainTS;
      public static void main(final String[] args)
              throws IOException, InterruptedException, ExecutionException, TimeoutException {
          Priorty2Arb runEngine = new Priorty2Arb();
          Spec spec = new Spec();
          spec.setcCode("r0,rm");
          spec.setoCode("g0,gm");
          Set<String> chan = new HashSet<>(Arrays.asList("r0,rm".split(",")));
          Set<String> out = new HashSet<>(Arrays.asList("g0,gm".split(",")));
          spec.getsInterface().setChannels(chan);
          spec.getsInterface().setOutput(out);
          spec.agentBuilder("A2:rm:gm;A1:r0:g0;");
          spec.assumptionBuilder("G F !rm".split(","));
          spec.guaranteeBuilder("G (!gm | !g0),G (rm -> X (!g0 U gm)),G (r0 -> F g0)".split(","));

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
          m.toDot(m, m.getName());		
    if (m.getStatus().equals("REALIZABLE")) {
    	TS ts = m.toTS(m, m.getName());
    	runEngine.processInput(ts, spec);
    }
    Strategy.delete();
      }    
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
