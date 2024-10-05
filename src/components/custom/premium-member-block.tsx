import React from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Crown } from 'lucide-react'

export const PremiumMemberBloc = () => {
  return (
    <Card>
      <CardHeader className="p-2 pt-0 md:p-4">
        <CardTitle className=' text-lg flex items-center'>
            Welcome to Premium <Crown   className="size-4 ml-2 fill-yellow-500 text-yellow-500" />
        </CardTitle>
        <CardDescription>
            Enjoy our premium features and get unlimited access to our support team.
        </CardDescription>
      </CardHeader>
      {/* //TODO:Future actions to be added here only for premium members */}
      {/* <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
        <Button size="sm" className="w-full" onClick={onClick}>
          Upgrade
        </Button>
      </CardContent> */}
    </Card>
  )
}

