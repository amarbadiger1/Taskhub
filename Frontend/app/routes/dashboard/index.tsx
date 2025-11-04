import { RecentProjects } from "~/components/dashboard/recnt-projects";
import { StatsCard } from "~/components/dashboard/stat-card";
import { StatisticsCharts } from "~/components/dashboard/statistics-charts";
import { Loader } from "~/components/loader";
import { UpcomingTasks } from "~/components/upcoming-tasks";
import { useGetWorkspaceStatsQuery } from "~/hooks/use-workspace";
import type {
  Project,
  ProjectStatusData,
  StatsCardProps,
  Task,
  TaskPriorityData,
  TaskTrendsData,
  WorkspaceProductivityData,
} from "~/types";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");

  const { data, isPending } = useGetWorkspaceStatsQuery(workspaceId!) as {
    data: {
      stats: StatsCardProps;
      taskTrendsData: TaskTrendsData[];
      projectStatusData: ProjectStatusData[];
      taskPriorityData: TaskPriorityData[];
      workspaceProductivityData: WorkspaceProductivityData[];
      upcomingTasks: Task[];
      recentProjects: Project[];
    };
    isPending: boolean;
  };

  if (!workspaceId) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <motion.h1
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl md:text-4xl font-extrabold text-blue-500 text-center"
        >
          <span className="inline-block bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
            Please Select the Workspace Above
          </span>
        </motion.h1>
      </div>
    );
  }

  if (isPending) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-8 2xl:space-y-12"
    >
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-2xl font-bold"
        >
          Dashboard
        </motion.h1>
      </div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <StatsCard data={data.stats} />
      </motion.div>

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <StatisticsCharts
          stats={data.stats}
          taskTrendsData={data.taskTrendsData}
          projectStatusData={data.projectStatusData}
          taskPriorityData={data.taskPriorityData}
          workspaceProductivityData={data.workspaceProductivityData}
        />
      </motion.div>

      {/* Projects & Tasks Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid gap-6 lg:grid-cols-2"
      >
        <RecentProjects data={data.recentProjects} />
        <UpcomingTasks data={data.upcomingTasks} />
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
