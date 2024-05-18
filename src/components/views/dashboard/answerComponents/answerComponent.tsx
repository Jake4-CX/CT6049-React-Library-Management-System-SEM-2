import { Card, CardContent } from "@/components/ui/card";
import { AxiosResponse } from "axios";
import { useEffect } from "react";
import { DecisionMakerQuestion } from "@/types/dashboard";
import moment from "moment";

type AnswerComponentProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: AxiosResponse<any, any>,
  queriedQuestion: DecisionMakerQuestion | undefined
}

const AnswerComponent: React.FC<AnswerComponentProps> = ({ data, queriedQuestion }) => {

  useEffect(() => {
    console.log("We got data: ", data);
  }, [data]);

  return (
    <>
      <Card className="min-h-[6rem] h-full w-full overflow-hidden flex justify-center items-center">
        <CardContent className="px-4 py-2">
          {
            data ? (
              <>
                {
                  data.status === 200 && queriedQuestion ? (
                    <AnswerContentComponent queriedQuestion={queriedQuestion} data={parseData(data)} />
                  ) : (
                    <p>Error</p>
                  )
                }
              </>
            ) : (
              <>
                <p>No data</p>
              </>
            )
          }
        </CardContent>
      </Card>
    </>
  )
}

type AnswerContentComponentProps = {
  queriedQuestion: DecisionMakerQuestion,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: { data: any, message: string } | undefined
}

const AnswerContentComponent: React.FC<AnswerContentComponentProps> = ({ queriedQuestion, data }) => {

  if (data === undefined) {
    return (
      <p>Error, data is undefined</p>
    )
  }

  switch (queriedQuestion.answerType) {
    case "NUMBER":
      return (
        <>
          <p className="text-muted-foreground font-normal text-center">
            {formatAnswerText(queriedQuestion.answerText, (data.data as number).toFixed(3))}
          </p>
        </>
      )
    case "TEXT":
      return (
        <>
          <p className="text-muted-foreground font-normal text-center">
            {formatAnswerText(queriedQuestion.answerText, (data.data as string))}
          </p>
        </>
      )
    case "PERCENTAGE":
      return (
        <>
          <p className="text-muted-foreground font-normal text-center">
            {formatAnswerText(queriedQuestion.answerText, (data.data as number).toFixed(2) + "%")}
          </p>
        </>
      )
    case "DURATION":
      return (
        <>
          <p className="text-muted-foreground font-normal text-center">
            {formatAnswerText(queriedQuestion.answerText, formatDuration(data.data as number) )}
          </p>
        </>
      )
    case "PIE_CHART":
      return (
        <>
          <p className="text-muted-foreground font-normal text-center">
            TODO
          </p>
        </>
      )
  }
}

function parseData(data: AxiosResponse) {
  if (data.status === 200) {
    return (data.data as { data: number, message: string });
  }

  return undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatAnswerText(answerText: string, value: any): React.ReactNode {
  const parts = answerText.split("%VALUE%");
  return (
    <>
      {parts[0]}
      <span className="font-bold">{value}</span>
      {parts[1]}
    </>
  );
}

function formatDuration(minutes: number): string {
  const duration = moment.duration(minutes, 'minutes');

  const days = Math.floor(duration.asDays());
  const hours = Math.floor(duration.asHours() % 24);
  const mins = duration.minutes();

  const daysString = days > 0 ? `${days} days` : "";
  const hoursString = hours > 0 ? `${hours} hours` : "";
  const minutesString = `${mins} minutes`;
  
  return [daysString, hoursString, minutesString].filter(Boolean).join(" and ");
}


export default AnswerComponent;