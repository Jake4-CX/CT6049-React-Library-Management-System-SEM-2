import { AxiosResponse } from "axios";

type DecisionMakerQuestion = {
  question: string,
  accountRole: "FINANCE_DIRECTOR" | "CHIEF_LIBRARIAN" | "LIBRARIAN" | "USER",
  questionType?: "DURATION" | "NUMBER" | "CATEGORY" | "AUTHOUR",
  answerType: "NUMBER" | "TEXT" | "PERCENTAGE" | "DURATION" | "PIE_CHART",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  answerText: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  answerComponent: React.FC<{ data?: AxiosResponse<any, any>, queriedQuestion: DecisionMakerQuestion | undefined }>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryFunction?: (params?: any) => Promise<AxiosResponse<any, any>>
}