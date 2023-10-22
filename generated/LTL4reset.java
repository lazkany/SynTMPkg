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

public class LTL4reset {
    private TS mainTS;
      public static void main(final String[] args)
              throws IOException, InterruptedException, ExecutionException, TimeoutException {
          LTL4reset runEngine = new LTL4reset();
          Spec spec = new Spec();
          spec.setcCode("r0,r1,r2,r3,rs");
          spec.setoCode("g0,g1,g2,g3");
          Set<String> chan = new HashSet<>(Arrays.asList("r0,r1,r2,r3,rs".split(",")));
          Set<String> out = new HashSet<>(Arrays.asList("g0,g1,g2,g3".split(",")));
          spec.getsInterface().setChannels(chan);
          spec.getsInterface().setOutput(out);
          spec.agentBuilder("A4:r3:g3;A3:r2:g2;A2:r1:g1;A1:r0,rs:g0;");
          spec.assumptionBuilder("true".split(","));
          spec.guaranteeBuilder("G (    !rs ->         (        (!g0 & !g1 & !g2) |         (!g0 & !g1 & !g3) |         (!g0 & !g3 & !g2) |         (!g3 & !g1 & !g2)        )     &        rs ->         (!g0 & !g1 & !g2& !g3)    ),G (r0 -> F g0),G (r1 -> F g1),G (r2 -> F g2),G (r3 -> F g3)".split(","));

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
