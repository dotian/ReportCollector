<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8" import="java.util.*,model.*,collector.*"%>

<jsp:useBean id="collector" class="collector.Collector" scope="page" />

{ 'latestBuildData': [<%
	List<ScenarioJob> jobs = collector.getAllScenarioJobs();
	int jobCount = jobs.size();
	for (int i = 0; i < jobCount; i++) {
		ScenarioJob job = jobs.get(i);
		if (job.getBuilds().size() > 0) {
			Collections.sort(job.getBuilds(), new Comparator<Build>() {
				public int compare(Build o1, Build o2) {
					return o1.getNumber() - o2.getNumber();
				}
			});

			// Get latest build
			Build build = job.getBuilds().get(
					job.getBuilds().size() - 1);

			int testCaseCount = build.getTestCases().size();
			for (int j = 0; j < testCaseCount; j++) {
				if (i != 0 || j != 0) {
					out.print(",");
				}
				TestCase testCase = build.getTestCases().get(j);
				out.print(String
						.format("{ScenarioName:'%s',BuildNum:%s,BuildUrl:'%s',ServerIP:'%s',Version:'%s',TestCase:'%s',Total:%s,Passed:%s,Failed:%s,Ignored:%s,Deffered:%s,PassRate:%s}",
								build.parentJob.name,
								build.getNumber(), build.getUrl(),
								build.getServerInfo().getServerIP(),
								build.getServerInfo()
										.getWindchillVersion(),
								testCase.name, testCase.getTotal(),
								testCase.getPassed(), testCase
										.getFailed(), testCase
										.getIgnored(), testCase
										.getDifferred(), testCase
										.getPassRate()));
			}
		}
	}
%>] }
