import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const settings = [
  { icon: "🖼️", name: "Resolution Threshold", value: "High" },
  { icon: "🌫️", name: "Blur Level", value: "Medium" },
  { icon: "📄", name: "Trusted Document Types", value: "Yes" },
  { icon: "🏢", name: "Trusted Issuers", value: "Yes" },
  { icon: "⚠️", name: "High Risk Threshold", value: "Low" },
]

export default function SettinngPage() {
  return (
    <div className="max-w-md  mt-10 p-6 bg-background rounded-lg ">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="space-y-2">
        {settings.map((setting) => (
          <Button
            key={setting.name}
            variant="ghost"
            className="w-full justify-start text-left font-normal"
          >
            <span className="mr-2 text-xl">{setting.icon}</span>
            <span className="flex-grow">{setting.name}</span>
            <span className="text-muted-foreground mr-2">{setting.value}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Button>
        ))}
      </div>
      <div className="flex justify-end mt-5">
           <Button >Save Settings</Button>
      </div>
    </div>
  )
}