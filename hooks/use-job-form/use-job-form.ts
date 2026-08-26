import { SubmitEvent } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogMode, ErrorMessage } from "@/lib/enums";
import { JobApplication } from "@/lib/models/models.types";
import { parseTags } from "@/lib/utils";
import { createJobApplication, updateJobApplication } from "@/lib/actions/job-applications";

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
  const { mode, columnId, boardId, setOpen } = props;
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

    const result =
      mode === DialogMode.Create
        ? await createJobApplication({
            ...data,
            columnId,
            boardId,
            tags,
          })
        : await updateJobApplication(job!._id, {
            ...data,
            columnId: job!.columnId,
            tags,
          });

    if (result.error) {
      console.error(
        mode === DialogMode.Create ? ErrorMessage.CreateJob : ErrorMessage.UpdateJob,
        result.error,
      );
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
