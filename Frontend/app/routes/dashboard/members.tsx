import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion"; // ✅ type-only import fixed
import { Loader } from "~/components/loader";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useGetWorkspaceDetailsQuery } from "~/hooks/use-workspace";
import type { Workspace } from "~/types";

const Members = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");

  const initialSearch = searchParams.get("search") || "";
  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    params.search = search;
    setSearchParams(params, { replace: true });
  }, [search]);

  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    if (urlSearch !== search) setSearch(urlSearch);
  }, [searchParams]);

  const { data: workspace, isLoading } = useGetWorkspaceDetailsQuery(workspaceId || "") as {
    data: Workspace;
    isLoading: boolean;
  };

  if (!workspaceId) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
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

  if (isLoading) return <Loader />;

  if (!workspace) return <div>No workspace found</div>;

  const filteredMembers = workspace.members.filter(
    (member) =>
      member.user.name.toLowerCase().includes(search.toLowerCase()) ||
      member.user.email.toLowerCase().includes(search.toLowerCase()) ||
      member.role?.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Properly typed animation variants
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start md:items-center justify-between">
        <h1 className="text-2xl font-bold">Workspace Members</h1>
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Input
          placeholder="Search members ...."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </motion.div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="board">Board View</TabsTrigger>
        </TabsList>

        {/* LIST VIEW */}
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Members</CardTitle>
              <CardDescription>
                {filteredMembers.length} members in your workspace
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="divide-y">
                {filteredMembers.map((member, i) => (
                  <motion.div
                    key={member.user._id}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                    className="flex flex-col md:flex-row items-center justify-between p-4 gap-3"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar className="bg-gray-500">
                        <AvatarImage src={member.user.profilePicture} />
                        <AvatarFallback>{member.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.user.name}</p>
                        <p className="text-sm text-gray-500">{member.user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 ml-11 md:ml-0">
                      <Badge
                        variant={["admin", "owner"].includes(member.role) ? "destructive" : "secondary"}
                        className="capitalize"
                      >
                        {member.role}
                      </Badge>

                      <Badge variant={"outline"}>{workspace.name}</Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* BOARD VIEW */}
        <TabsContent value="board">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMembers.map((member, i) => (
              <motion.div
                key={member.user._id}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={i}
              >
                <Card>
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <Avatar className="bg-gray-500 mb-4">
                      <AvatarImage src={member.user.profilePicture} />
                      <AvatarFallback className="uppercase">
                        {member.user.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    <h3 className="text-lg font-medium mb-2">{member.user.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{member.user.email}</p>

                    <Badge
                      variant={["admin", "owner"].includes(member.role) ? "destructive" : "secondary"}
                    >
                      {member.role}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Members;
