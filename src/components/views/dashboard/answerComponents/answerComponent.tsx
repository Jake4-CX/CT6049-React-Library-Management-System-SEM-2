import { Card, CardContent } from "@/components/ui/card";
import { AxiosResponse } from "axios";
import { useEffect } from "react";
import { DecisionMakerQuestion } from "@/types/dashboard";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
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
      <Card className="min-h-[6rem] h-fit w-full overflow-hidden flex justify-center items-center">
        <CardContent className="px-4 py-2">
          {
            data ? (
              <>
                {
                  data.status === 200 && queriedQuestion ? (
                    <AnswerContentComponent queriedQuestion={queriedQuestion} data={data} />
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
  data: AxiosResponse<any, any> // { data: any, message: string } | undefined
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
            {formatAnswerText(queriedQuestion.answerText, (parseData(data)?.data as number).toFixed(3))}
          </p>
        </>
      )
    case "TEXT":
      return (
        <>
          <p className="text-muted-foreground font-normal text-center">
            {formatAnswerText(queriedQuestion.answerText, (parseData(data)?.data as string))}
          </p>
        </>
      )
    case "PERCENTAGE":
      return (
        <>
          <p className="text-muted-foreground font-normal text-center">
            {formatAnswerText(queriedQuestion.answerText, (parseData(data)?.data as number).toFixed(2) + "%")}
          </p>
        </>
      )
    case "DURATION":
      return (
        <>
          <p className="text-muted-foreground font-normal text-center">
            {formatAnswerText(queriedQuestion.answerText, formatDuration(parseData(data)?.data as number))}
          </p>
        </>
      )
    case "PIE_CHART":
      return (
        <>
          <PieChartComponent data={parsePiechartData(data)} />
        </>
      )
  }
}

function parseData(data: AxiosResponse) {
  if (data.status === 200) {
    return (data.data as { data: number | string, message: string });
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

function parsePiechartData(data: AxiosResponse) {
  if (data.status === 200) {
    return (data.data as { data: { key: string, value: number }[], message: string });
  }

  return undefined;
}

const PieChartComponent: React.FC<{ data?: { data: { key: string, value: number }[] } }> = ({ data }) => {
  if (!data || !data.data) {
    return <p>Error, no data available for the pie chart</p>;
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div style={{ height: 240, width: 200 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data.data}
            dataKey="value"
            nameKey="key"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {data.data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnswerComponent;