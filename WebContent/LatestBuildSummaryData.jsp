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
			// TODO: create getAllLatestBuild method in collector.
			Build build = job.getBuilds().get(
					job.getBuilds().size() - 1);

			if (i != 0) {
				out.print(",");
			}
			
			out.print(String
					.format("{ScenarioName:'%s',Passed:%s,Failed:%s,Ignored:%s,Deffered:%s}",
							build.parentJob.name, build.getPassed(),
							build.getFailed(), build.getIgnored(),
							build.getDeffered()));
		}
	}
%>] }
