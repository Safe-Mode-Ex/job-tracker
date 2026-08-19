import { Column, JobApplication } from "@/lib/models/models.types";
import JobApplicationCard from "./job-application-card";

interface JobCardProps {
  job: JobApplication;
  columns: Column[];
}

export default function SortableJobCard({ job, columns }: JobCardProps) {
  return (
    <div>
      <JobApplicationCard job={job} columns={columns} />
    </div>
  );
}
