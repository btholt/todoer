import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "@/lib/stack";

interface HandlerProps {
  params: Promise<Record<string, unknown>>;
  searchParams: Promise<Record<string, unknown>>;
}

export default function Handler(props: HandlerProps) {
  return <StackHandler fullPage app={stackServerApp} routeProps={props} />;
}