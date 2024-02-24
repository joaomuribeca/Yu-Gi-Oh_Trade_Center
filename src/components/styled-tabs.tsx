import { RectangleVertical, Repeat } from 'lucide-react'
import { ReactNode } from 'react'

import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Tab {
  value: string
  title: string
}

interface StyledTabsProps {
  tabs: Tab[]
  defaultTab: string
  children?: ReactNode
}

export function StyledTabs({ tabs, defaultTab, children }: StyledTabsProps) {
  return (
    <Tabs defaultValue={defaultTab} className="flex w-full gap-8">
      <TabsList asChild className="mt-2 h-fit">
        <Card className="flex w-80 min-w-60 flex-col">
          {tabs.map((tab) => {
            return (
              <TabsTrigger
                className="flex w-full justify-start py-3"
                key={tab.value}
                value={tab.value}
              >
                {tab.value === 'exchanges' ? (
                  <Repeat className=" mr-2 h-4 w-4" />
                ) : (
                  <RectangleVertical className=" mr-2 h-4 w-4" />
                )}
                {tab.title}
              </TabsTrigger>
            )
          })}
        </Card>
      </TabsList>
      {children}
    </Tabs>
  )
}
