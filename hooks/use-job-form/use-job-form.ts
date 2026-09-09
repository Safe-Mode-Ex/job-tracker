import { SubmitEvent } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { DialogMode, ErrorMessage } from "@/lib/enums";
import { JobApplication } from "@/lib/models/models.types";
import { parseTags } from "@/lib/utils";
import { JobApplicationData } from "@/lib/actions/job-applications";

const jobFormSchema = z.object({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  location: z.string(),
  salary: z.string(),
  jobUrl: z.string(),
  tags: z.string(),
  description: z.string(),
  notes: z.string(),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

type UseJobFormProps = {
  mode: typeof DialogMode.Edit | typeof DialogMode.Create;
  columnId: string;
  boardId: string;
  job?: JobApplication;
  setOpen: (isOpen: boolean) => void,
  createJob?: (data: JobApplicationData) => Promise<{ data?: JobApplication; error?: string }>;
  updateJob?: (id: string, updates: Record<string, unknown>) => Promise<{ data?: JobApplication; error?: string }>;
}

const INITIAL_FORM_DATA: JobFormValues = {
  company: '',
  position: '',
  location: '',
  notes: '',
  salary: '',
  jobUrl: '',
  tags: '',
  description: '',
};

export default function useJobForm(props: UseJobFormProps): {
  register: ReturnType<typeof useForm<JobFormValues>>['register'];
  handleSubmit: (evt: SubmitEvent<HTMLFormElement>) => void;
  formState: ReturnType<typeof useForm<JobFormValues>>['formState'];
} {
  const { mode, columnId, boardId, setOpen, createJob, updateJob } = props;
  const job = mode === DialogMode.Edit ? props.job : undefined;

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues:
      mode === DialogMode.Edit
        ? {
            company: job!.company,
            position: job!.position,
            location: job!.location ?? '',
            salary: job!.salary ?? '',
            jobUrl: job!.jobUrl ?? '',
            tags: job!.tags?.join(', ') ?? '',
            description: job!.description ?? '',
            notes: job!.notes ?? '',
          }
        : INITIAL_FORM_DATA,
  });

  const onValid: SubmitHandler<JobFormValues> = async (data) => {
    const tags = parseTags(data.tags);

    let result: { data?: JobApplication; error?: string };

    if (mode === DialogMode.Create) {
      result = createJob
        ? await createJob({ ...data, columnId, boardId, tags })
        : { error: ErrorMessage.CreateJob };
    } else {
      result = updateJob
        ? await updateJob(job!._id, { ...data, columnId: job!.columnId, tags })
        : { error: ErrorMessage.UpdateJob };
    }

    if (result.error) {
      toast.error(result.error);
      return;
    }

    if (mode === DialogMode.Create) {
      form.reset();
    }
    setOpen(false);
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    void form.handleSubmit(onValid)();
  };

  return { register: form.register, handleSubmit, formState: form.formState };
}
