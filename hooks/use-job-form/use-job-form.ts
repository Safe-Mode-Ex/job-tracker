import { useState, ChangeEvent, SubmitEvent } from "react";
import { createJobApplication, updateJobApplication } from "@/lib/actions/job-applications";
import { DialogMode, ErrorMessage } from "@/lib/enums";
import { JobApplication } from "@/lib/models/models.types";
import { parseTags } from "@/lib/utils";

interface JobFormData {
  company: string;
  position: string;
  location: string;
  notes: string;
  salary: string;
  jobUrl: string;
  tags: string;
  description: string;
};

type UseJobFormProps = {
  mode: typeof DialogMode.Edit | typeof DialogMode.Create;
  columnId: string;
  boardId: string;
  job?: JobApplication;
  setOpen: (isOpen: boolean) => void,
}

const INITIAL_FORM_DATA: JobFormData = {
  company: '',
  position: '',
  location: '',
  notes: '',
  salary: '',
  jobUrl: '',
  tags: '',
  description: '',
};

export default function useJobForm(props: UseJobFormProps): [
  JobFormData,
  ({ target }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  (evt: SubmitEvent<HTMLFormElement>) => Promise<void>,
] {
  const { mode, columnId, boardId, setOpen } = props;
  const job = mode === DialogMode.Edit ? props.job : undefined;

  const [formData, setFormData] = useState<JobFormData>(
    mode === DialogMode.Edit
      ? {
          company: job!.company,
          position: job!.position,
          location: job!.location ?? '',
          notes: job!.notes ?? '',
          salary: job!.salary ?? '',
          jobUrl: job!.jobUrl ?? '',
          tags: job!.tags?.join(', ') ?? '',
          description: job!.description ?? '',
        }
      : INITIAL_FORM_DATA,
  );

  const handleFormFieldChange = ({ target }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData({
      ...formData,
      [target.id]: target.value,
    });

  const handleSubmit = async (evt: SubmitEvent<HTMLFormElement>) => {
    evt.preventDefault();

    try {
      const tags = parseTags(formData.tags);

      const result =
        mode === DialogMode.Create
          ? await createJobApplication({
              ...formData,
              columnId,
              boardId,
              tags,
            })
          : await updateJobApplication(job!._id, {
              ...formData,
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

      setFormData(INITIAL_FORM_DATA);
      setOpen(false);
    } catch (error) {
      console.error(
        mode === DialogMode.Create ? ErrorMessage.CreateJob : ErrorMessage.UpdateJob,
        error,
      );
    }
  };

  return [formData, handleFormFieldChange, handleSubmit];
}
