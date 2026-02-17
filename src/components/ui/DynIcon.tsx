import * as Lucide from "lucide-react";

export const DynIcon = ({ name = "help-circle", ...props }: any) => {
  const Icon = (Lucide as any)[name.split("-").map((w,i)=> i ? w[0].toUpperCase()+w.slice(1) : w[0].toUpperCase()+w.slice(1)).join("")];
  return Icon ? <Icon {...props} /> : <Lucide.HelpCircle {...props} />;
};