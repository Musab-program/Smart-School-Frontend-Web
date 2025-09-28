import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { CardHeader } from '@material-tailwind/react'
import React from 'react'
import { LucideIcon } from 'lucide-react'; 
interface StatsCardProps {
    title: string;       
    icon: LucideIcon;    
    description: string; 
  }
export default StatsCard({CardHeader } : StatsCardProps) {
  return (
    <Card>
        <CardHeader>

        </CardHeader>
        <CardTitle>

        </CardTitle>
        <CardContent>

        </CardContent>
    </Card>
  )
}


function StatsCard(p0: {}, StatsCardProps: any) {
    throw new Error('Function not implemented.')
}

