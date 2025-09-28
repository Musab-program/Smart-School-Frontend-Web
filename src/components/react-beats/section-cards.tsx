import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, School, Book } from "lucide-react";

const cardData = [
  {
    title: "الطلاب",
    content: "1,250",
    icon: <Users className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: "المعلمين",
    content: "80",
    icon: <Users className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: "الصفوف",
    content: "45",
    icon: <School className="h-4 w-4 text-muted-foreground" />,
  },
  {
    title: "المجموعات",
    content: "120",
    icon: <Book className="h-4 w-4 text-muted-foreground" />,
  },
];

export function SectionCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      {cardData.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            {card.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.content}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}