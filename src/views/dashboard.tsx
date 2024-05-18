import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import DefaultLayout from "@/layouts/defaultLayout";
import { useAppSelector } from "@/redux/store";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getAverageBooksPerAuthor, getAverageBooksPerCategory, getAverageLoanDurationLastDuration, getAverageLoanDurationLastYear, getAverageTimeToPayFine, getPercentageBooksCurrentlyOverdue, getPercentageBooksReturnedLate } from "@/api/chief-librarian";
import { AxiosResponse } from "axios";
import { RefreshCw } from "lucide-react";
import { getAverageFinesLast30Days, getPercentageUnpaidFines, getPopularAuthorUnpaidFines, getPopularCategoryUnpaidFines, getTotalUnpaidFines } from "@/api/finance-director";
import { getAverageBooksLoanedLastQuarter, getMostPopularAuthorCurrentlyLoaned, getMostPopularCategoryCurrentlyLoaned, getPercentageBooksCurrentlyLoaned } from "@/api/librarian";
import AnswerComponent from "@/components/views/dashboard/answerComponents/answerComponent";
import { DecisionMakerQuestion } from "@/types/dashboard";

const DashboardPage: React.FC = () => {

  const userRedux = useAppSelector((state) => state.userReduser.value);
  const userRole = userRedux.userData?.userRole;

  const [selectedQuestion, setSelectedQuestion] = useState<DecisionMakerQuestion | undefined>(undefined);
  const [queriedQuestion, setQueriedQuestion] = useState<DecisionMakerQuestion | undefined>(undefined);

  useEffect(() => {
    if (selectedQuestion) {
      console.log(selectedQuestion);
    }

  }, [selectedQuestion]);

  // Argument values
  const [argumentDuration, setArgumentDuration] = useState<number | undefined>(undefined);
  const [argumentCategory, setArgumentCategory] = useState<string | undefined>(undefined);
  const [argumentAuthor, setArgumentAuthor] = useState<string | undefined>(undefined);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [queryResult, setQueryResult] = useState<AxiosResponse<any, any> | null>(null);

  const { mutate, isPending } = useMutation({
    mutationKey: ["query", selectedQuestion, argumentDuration, argumentCategory, argumentAuthor],
    mutationFn: selectedQuestion?.queryFunction,
    onSuccess: (data: AxiosResponse) => {
      console.log(data);
      setQueriedQuestion(selectedQuestion);
      setQueryResult(data);
    },
    onError: (error) => {
      console.error(error);
      setQueryResult(null);
      setQueriedQuestion(undefined);
    }
  });

  useEffect(() => {
    if (selectedQuestion) {
      console.log(selectedQuestion);
    }

  }, [selectedQuestion]);

  async function searchQuery() {
    // Query logic
    if (!selectedQuestion) {
      toast.error("Please select a question to query.");
      return;
    }

    if (selectedQuestion.questionType != undefined) {
      if (selectedQuestion.questionType === "DURATION" && argumentDuration === undefined) {
        toast.error("Please enter a duration for the query.");
        return;
      } else if (selectedQuestion.questionType === "CATEGORY" && argumentCategory === undefined) {
        toast.error("Please select a category for the query.");
        return;
      } else if (selectedQuestion.questionType === "AUTHOUR" && argumentAuthor === undefined) {
        toast.error("Please select an author for the query.");
        return;
      }
    }

    if (selectedQuestion.queryFunction) {
      const params = selectedQuestion.questionType === "DURATION" ? ((argumentDuration || 30) * 24 * 60 * 60 * 1000) // days into milliseconds
        : selectedQuestion.questionType === "CATEGORY" ? argumentCategory
          : selectedQuestion.questionType === "AUTHOUR" ? argumentAuthor
            : undefined;

      mutate(params);
      mutate(params);
    } else {
      toast.error("No query function defined for the selected question.");
    }
  }

  return (
    <DefaultLayout>
      <Card className="w-full h-[32rem] mt-[4%]">
        <CardHeader>
          <CardTitle>LWS Dashboard</CardTitle>
          <CardDescription>Your role: {accountRoles.find(role => role.value === userRole)?.label || "Loading..."}</CardDescription>
        </CardHeader>
        <CardContent>
          <Card className="px-8 py-4 h-[24rem]">
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
              <SearchComponent userRole={userRole} setSelectedQuestion={setSelectedQuestion} />
              <ArgumentComponent
                selectedQuestion={selectedQuestion}
                argumentDuration={argumentDuration}
                argumentAuthor={argumentAuthor}
                argumentCategory={argumentCategory}
                setArgumentDuration={setArgumentDuration}
                setArgumentAuthor={setArgumentAuthor}
                setArgumentCategory={setArgumentCategory}
              />
              <Button onClick={searchQuery} disabled={isPending} className="flex justify-center items-center md:w-[71px]">{
                isPending ? (
                  <RefreshCw className="animate-spin w-4 h-4" />
                ) : (
                  "Query"
                )
              }</Button>
            </div>
            <div className="mt-3 max-h-[65%] md:h-[80%]">
              {
                isPending ? (
                  <Card className="min-h-[6rem] h-full w-full overflow-hidden flex justify-center items-center">
                    <CardContent className="px-4 py-2">
                      <div className="flex flex-row space-x-3">
                        <RefreshCw className="animate-spin w-4 h-4 my-auto" />
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  queryResult && selectedQuestion?.answerComponent ? (
                    <selectedQuestion.answerComponent data={queryResult} queriedQuestion={queriedQuestion} />
                  ) : (
                    <>
                      <Card className="min-h-[6rem] h-full w-full overflow-hidden flex justify-center items-center">
                        <CardContent className="px-4 py-2">
                          <div className="flex flex-row space-x-3">
                            {/* <Search className="h-3 w-3 my-auto text-muted-foreground stroke-[2px]" /> */}
                            <p className="text-muted-foreground font-light text-center">To get started, select a question and click "Query".</p>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )
                )
              }
            </div>
          </Card>
        </CardContent>
        <CardFooter className="flex justify-between">
        </CardFooter>
      </Card>
    </DefaultLayout>
  )
}

type SearchComponentProps = {
  userRole: string | undefined,
  setSelectedQuestion: (question: DecisionMakerQuestion | undefined) => void
}

const SearchComponent: React.FC<SearchComponentProps> = ({ userRole, setSelectedQuestion }) => {

  const handleValueChange = (value: string) => {
    const question = JSON.parse(value) as DecisionMakerQuestion;
    setSelectedQuestion(findDecisionMarkerQuestionFromQuestion(question.question));
  };


  return (
    <Select onValueChange={handleValueChange}>
      <SelectTrigger className="md:max-w-[46.125rem]">
        <SelectValue placeholder="Select a question" />
      </SelectTrigger>
      <SelectContent className="w-min">
        <SelectGroup>
          <SelectLabel>Questions:</SelectLabel>
          {
            decisionMakerQuestions.filter(question => question.accountRole === userRole).map((question) => (
              <SelectItem className="w-full line-clamp-4 overflow-hidden" key={question.question} value={JSON.stringify(question)}>{question.question}</SelectItem>
            ))
          }
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

type ArgumentComponentProps = {
  selectedQuestion: DecisionMakerQuestion | undefined,
  argumentDuration: number | undefined,
  argumentCategory: string | undefined,
  argumentAuthor: string | undefined,
  setArgumentDuration: (duration: number) => void,
  setArgumentCategory: (category: string) => void,
  setArgumentAuthor: (author: string) => void
}

const ArgumentComponent: React.FC<ArgumentComponentProps> = (props) => {
  const selectedQuestion = props.selectedQuestion;

  if (selectedQuestion != undefined && (selectedQuestion.questionType != null)) {

    switch (selectedQuestion.questionType) {
      case "NUMBER": {
        return (
          <>
            <Input type="number" placeholder="Enter a number" className="w-full md:max-w-[12rem]" onChange={(e) => props.setArgumentDuration(parseInt(e.target.value))} />
          </>
        );
      }
      case "DURATION": {
        return (
          <>
            <Select onValueChange={(v) => props.setArgumentDuration(Number(v))}>
              <SelectTrigger className="w-full md:max-w-[12rem]">
                <SelectValue placeholder="Select a duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Durations:</SelectLabel>
                  <SelectItem value={"1"}>day</SelectItem>
                  <SelectItem value={"3"}>3 days</SelectItem>
                  <SelectItem value={"7"}>7 days</SelectItem>
                  <SelectItem value={"30"}>30 days</SelectItem>
                  <SelectItem value={"90"}>90 days</SelectItem>
                  <SelectItem value={"180"}>180 days</SelectItem>
                  <SelectItem value={"365"}>year</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </>
        );
      }

      case "CATEGORY": {
        return (
          <>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories:</SelectLabel>
                  <SelectItem value="ACTION">Action</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </>
        );
      }
      case "AUTHOUR": {
        return (
          <>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an author" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Authors:</SelectLabel>
                  <SelectItem value="AUTHOUR">Author</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </>
        );
      }
      default: {
        return <>Error</>;
      }
    }
  } else {
    return <></>;
  }
}

const accountRoles = [{
  value: "FINANCE_DIRECTOR",
  label: "Finance Director"
}, {
  value: "CHIEF_LIBRARIAN",
  label: "Chief Librarian"
}, {
  value: "LIBRARIAN",
  label: "Librarian"
}];

function findDecisionMarkerQuestionFromQuestion(question: string): DecisionMakerQuestion | undefined {
  return decisionMakerQuestions.find(q => q.question === question);
}

const financeDirectorDecisionMakerQuestions = [
  {
    question: "What is the most popular category with unpaid fines?",
    accountRole: "FINANCE_DIRECTOR",
    answerText: "The most popular category with unpaid fines is: %VALUE%",
    answerType: "TEXT",
    answerComponent: AnswerComponent,
    queryFunction: getPopularCategoryUnpaidFines
  }, {
    question: "What is the most popular author with unpaid fines?",
    accountRole: "FINANCE_DIRECTOR",
    answerText: "The most popular author with unpaid fines is: %VALUE%",
    answerType: "TEXT",
    answerComponent: AnswerComponent,
    queryFunction: getPopularAuthorUnpaidFines
  }, {
    question: "What is the average amount of fines paid in the last 30 days?",
    accountRole: "FINANCE_DIRECTOR",
    answerText: "The average amount of fines paid in the last 30 days is: %VALUE%",
    answerType: "NUMBER",
    answerComponent: AnswerComponent,
    queryFunction: getAverageFinesLast30Days
  }, {
    question: "What is the percentage of fines that are unpaid?",
    accountRole: "FINANCE_DIRECTOR",
    answerText: "The percentage of fines that are unpaid is: %VALUE%",
    answerType: "PERCENTAGE",
    answerComponent: AnswerComponent,
    queryFunction: getPercentageUnpaidFines
  }, {
    question: "What is the total amount of money for unpaid fines?",
    accountRole: "FINANCE_DIRECTOR",
    answerText: "The total amount of money for unpaid fines is: %VALUE%",
    answerType: "NUMBER",
    answerComponent: AnswerComponent,
    queryFunction: getTotalUnpaidFines
  }
] as DecisionMakerQuestion[];

const chiefLibrarianDecisionMakerQuestions = [
  {
    question: "What is the average number of books that the library has per author?",
    accountRole: "CHIEF_LIBRARIAN",
    answerText: "The average number of books that the library has per author is: %VALUE%",
    answerType: "NUMBER",
    answerComponent: AnswerComponent,
    queryFunction: getAverageBooksPerAuthor
  }, {
    question: "What is the average number of books that the library has per category?",
    accountRole: "CHIEF_LIBRARIAN",
    answerText: "The average number of books that the library has per category is: %VALUE%",
    answerType: "NUMBER",
    answerComponent: AnswerComponent,
    queryFunction: getAverageBooksPerCategory
  }, {
    question: "What is the average loan duration for books in the last ...?",
    accountRole: "CHIEF_LIBRARIAN",
    questionType: "DURATION",
    answerText: "The average loan duration for books in the specified period is: %VALUE%",
    answerType: "DURATION",
    answerComponent: AnswerComponent,
    queryFunction: getAverageLoanDurationLastDuration
  }, {
    question: "What is the average time it takes for users to pay their fines?",
    accountRole: "CHIEF_LIBRARIAN",
    answerText: "The average time it takes for users to pay their fines is: %VALUE%",
    answerType: "DURATION",
    answerComponent: AnswerComponent,
    queryFunction: getAverageTimeToPayFine
  }, {
    question: "What percentage of books are currently overdue?",
    accountRole: "CHIEF_LIBRARIAN",
    answerText: "The percentage of books that are currently overdue is: %VALUE%",
    answerType: "PERCENTAGE",
    answerComponent: AnswerComponent,
    queryFunction: getPercentageBooksCurrentlyOverdue
  }, {
    question: "What is the percentage of books that were returned late?", // Perhaps questionType duration?
    accountRole: "CHIEF_LIBRARIAN",
    answerText: "The percentage of books that were returned late is: %VALUE%",
    answerType: "PERCENTAGE",
    answerComponent: AnswerComponent,
    queryFunction: getPercentageBooksReturnedLate
  },
] as DecisionMakerQuestion[];

const librarianDecisionMakerQuestions = [
  {
    question: "What is the average number of books borrowed by each user during the last quarter?",
    accountRole: "LIBRARIAN",
    answerText: "The average number of books borrowed by each user during the last quarter is: %VALUE%",
    answerType: "NUMBER",
    answerComponent: AnswerComponent,
    queryFunction: getAverageBooksLoanedLastQuarter
  }, {
    question: "What is the most popular author with currently loaned books?",
    accountRole: "LIBRARIAN",
    answerText: "The most popular author with currently loaned books is: %VALUE%",
    answerType: "TEXT",
    answerComponent: AnswerComponent,
    queryFunction: getMostPopularAuthorCurrentlyLoaned
  }, {
    question: "What is the most popular category with currently loaned books?",
    accountRole: "LIBRARIAN",
    answerText: "The most popular category with currently loaned books is: %VALUE%",
    answerType: "TEXT",
    answerComponent: AnswerComponent,
    queryFunction: getMostPopularCategoryCurrentlyLoaned
  }, {
    question: "What percentage of books are currently loaned?",
    accountRole: "LIBRARIAN",
    answerText: "The percentage of books that are currently loaned is: %VALUE%",
    answerType: "PERCENTAGE",
    answerComponent: AnswerComponent,
    queryFunction: getPercentageBooksCurrentlyLoaned
  }
] as DecisionMakerQuestion[];

const decisionMakerQuestions = [
  ...financeDirectorDecisionMakerQuestions,
  ...chiefLibrarianDecisionMakerQuestions,
  ...librarianDecisionMakerQuestions
] as DecisionMakerQuestion[];

export default DashboardPage;