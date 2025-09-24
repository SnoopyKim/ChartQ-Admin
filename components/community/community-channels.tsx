"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/shadcn/button";
import { Badge } from "@/components/shadcn/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import { getActiveCommunityChannels } from "@/services/community";
import { CommunityChannel } from "@/types/system";
import { ExternalLink, Users, MessageCircle } from "lucide-react";

export default function CommunityChannels() {
  const [channels, setChannels] = useState<CommunityChannel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setIsLoading(true);
        const data = await getActiveCommunityChannels();
        setChannels(data || []);
      } catch (error) {
        console.error("Error fetching community channels:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChannels();
  }, []);

  const handleChannelClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            커뮤니티 채널
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (channels.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-blue-600" />
          커뮤니티 채널
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {channels.map((channel) => (
            <Button
              key={channel.id}
              variant="outline"
              className="w-full justify-between h-auto p-4 hover:bg-blue-50 hover:border-blue-300 transition-colors"
              onClick={() => handleChannelClick(channel.url)}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {channel.icon && (
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center overflow-hidden">
                    {channel.icon.startsWith("http") ? (
                      <img
                        src={channel.icon}
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-lg">{channel.icon}</span>
                    )}
                  </div>
                )}
                <div className="text-left flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {channel.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {channel.url}
                  </div>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400" />
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
