import { NextPage } from "next";
import { useNetworkStatusContext } from "@/components/providers/network-status-provider";
import { NetworkStatusIndicator } from "@/components/ui/network-status-indicator";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const NetworkTestPage: NextPage = () => {
  const { networkStatus } = useNetworkStatusContext();
  const [pingResult, setPingResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Only render client-side content after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTestPing = async () => {
    try {
      setIsLoading(true);
      setPingResult(null);

      const response = await fetch("/api/ping", { cache: "no-store" });
      const data = await response.json();

      setPingResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setPingResult(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Network Status Test</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Current Network Status</h2>
          <div className="flex items-center gap-4 mb-6">
            <NetworkStatusIndicator showText className="text-lg" />
          </div>

          {mounted && (
            <div className="p-4 bg-slate-100 rounded-md">
              <pre className="text-sm whitespace-pre-wrap">
                {JSON.stringify({ networkStatus }, null, 2)}
              </pre>
            </div>
          )}

          <div className="mt-6">
            <p className="text-sm text-slate-500 mb-2">
              Try turning off your network connection to see the status change.
            </p>
          </div>
        </div>

        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Test Server Connection</h2>
          <Button
            onClick={handleTestPing}
            disabled={isLoading || !mounted}
            className="mb-4"
          >
            {isLoading ? "Pinging..." : "Ping Server"}
          </Button>

          {pingResult && (
            <div className="p-4 bg-slate-100 rounded-md">
              <h3 className="font-medium mb-2">Response:</h3>
              <pre className="text-sm whitespace-pre-wrap">{pingResult}</pre>
            </div>
          )}

          <div className="mt-6">
            <p className="text-sm text-slate-500">
              This tests the connection to the server by calling the /api/ping
              endpoint.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 border rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">How It Works</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            The network status is monitored using the browser's online/offline
            events
          </li>
          <li>
            When the browser reports "online", we verify by pinging the server
          </li>
          <li>
            Toast notifications appear only when there's an actual status change
          </li>
          <li>
            The status indicator in the sidebar shows the current connection
            state
          </li>
          <li>
            Uses client-side detection to prevent hydration errors in Next.js 12
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NetworkTestPage;
