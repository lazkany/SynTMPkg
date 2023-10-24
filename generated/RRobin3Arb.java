package generated;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.lang.ProcessBuilder.Redirect;
import java.util.HashSet;
import java.util.Random;
import java.util.Set;
import java.util.Arrays;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeoutException;

import com.syntm.analysis.Partitioning;
import com.syntm.lts.Int;
import com.syntm.lts.Mealy;
import com.syntm.lts.Spec;
import com.syntm.lts.State;
import com.syntm.lts.TS;

public class RRobin3Arb {
    private TS mainTS;
      public static void main(final String[] args)
              throws IOException, InterruptedException, ExecutionException, TimeoutException {
          RRobin3Arb runEngine = new RRobin3Arb();
          Spec spec = new Spec();
          spec.setcCode("r0,r1,r2");
          spec.setoCode("g0,g1,g2");
          Set<String> chan = new HashSet<>(Arrays.asList("r0,r1,r2".split(",")));
          Set<String> out = new HashSet<>(Arrays.asList("g0,g1,g2".split(",")));
          spec.getsInterface().setChannels(chan);
          spec.getsInterface().setOutput(out);
          spec.agentBuilder("A3:r2:g2;A2:r1:g1;A1:r0:g0;");
          spec.assumptionBuilder("G ((r0 & !g0) -> X r0),G ((r1 & !g1) -> X r1),G ((r2 & !g2) -> X r2),G ((!r0 & g0) -> X !r0),G ((!r1 & g1) -> X !r1),G ((!r2 & g1) -> X !r2),G F (!r0 | !g0),G F (!r1 | !g1),G F (!r2 | !g2)".split(","));
          spec.guaranteeBuilder("G ((!g0 & !g1) | ((!g0 | !g1) & !g2)),G (r0 -> F g0),G (r1 -> F g1),G (r2 -> F g2)".split(","));

    String command = spec.toString();
    System.out.println(command);
    ProcessBuilder p = new ProcessBuilder("docker", "run", "lazkany/strix", "-f", command, spec.inParam(),
    		spec.outParam(), "--k");

    File Strategy = new File("Mealy");
          if (Strategy.exists()) {
              FileOutputStream fos = new FileOutputStream(Strategy, false);
          }
    p.redirectErrorStream(true);
    p.redirectOutput(Redirect.appendTo(Strategy));
    Process proc = p.start();
    proc.waitFor();

    Mealy m = new Mealy("");
    m.kissToMealy("Mealy", spec.getcCode(), spec.getoCode());
          m.toDot(m, m.getName());		
    if (m.getStatus().equals("REALIZABLE")) {
    	TS ts = m.toTS(m, m.getName());
              if (!ts.getStatus().equals("ND")) {
    		System.out.println("Specification is REALIZABLE for Multi-Agents. You will get a distributed Implementation :)");
    		runEngine.processInput(ts, spec);
    	}
    	else
    	{
    		System.out.println("Despite the realizablity of the specification on a single agent, it cannot be realized in our distributed model. The translation to TS resulted in a non-determinstic TS.");
                  System.out.println("");
                  System.out.println("");
    	}
    }
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
