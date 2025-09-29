
import { LucideIcon } from 'lucide-react'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {StatsCardProps} from "@/types/statecard"





  export function StatsCard({ title, value, icon: Icon, description }: StatsCardProps) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">

        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
  )
}




