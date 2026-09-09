import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Column, JobApplication } from "@/lib/models/models.types";
import { JobApplicationUpdate } from "@/lib/actions/job-applications";
import JobApplicationCard from "./job-application-card";

interface JobCardProps {
  job: JobApplication;
  columns: Column[];
  moveJob: (id: string, columnId: string, order: number) => Promise<void>;
  deleteJob: (id: string) => void;
  updateJob: (id: string, updates: JobApplicationUpdate) => Promise<{ data?: JobApplication; error?: string }>;
}

export default function SortableJobCard({ job, columns, moveJob, deleteJob, updateJob }: JobCardProps) {
  const {
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
    setNodeRef,
  } = useSortable({
    id: job._id,
    data: {
      type: 'job',
      job,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <JobApplicationCard
        job={job}
        columns={columns}
        dragHandleProps={{...attributes, ...listeners}}
        moveJob={moveJob}
        deleteJob={deleteJob}
        updateJob={updateJob}
      />
    </div>
  );
}
