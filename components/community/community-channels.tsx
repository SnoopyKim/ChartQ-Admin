"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/shadcn/button";
import { Badge } from "@/components/shadcn/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
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
              <div className="flex items-center gap-3">
                {channel.icon && (
                  <span className="text-lg">{channel.icon}</span>
                )}
                <div className="text-left">
                  <div className="font-medium text-gray-900">{channel.name}</div>
                  <div className="text-xs text-gray-500 truncate max-w-[200px]">
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

// 간단한 인라인 버튼 버전 (다른 페이지에 임베드용)
export function CommunityChannelButtons() {
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

  if (isLoading || channels.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {channels.map((channel) => (
        <Button
          key={channel.id}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => handleChannelClick(channel.url)}
        >
          {channel.icon && <span>{channel.icon}</span>}
          {channel.name}
          <ExternalLink className="h-3 w-3" />
        </Button>
      ))}
    </div>
  );
}

// 플로팅 커뮤니티 버튼 (우하단 고정)
export function FloatingCommunityButton() {
  const [channels, setChannels] = useState<CommunityChannel[]>([]);
  const [isOpen, setIsOpen] = useState(false);
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
    setIsOpen(false);
  };

  if (isLoading || channels.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg border p-2 min-w-[200px]">
          <div className="space-y-1">
            {channels.map((channel) => (
              <Button
                key={channel.id}
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleChannelClick(channel.url)}
              >
                {channel.icon && <span className="mr-2">{channel.icon}</span>}
                {channel.name}
                <ExternalLink className="h-3 w-3 ml-auto" />
              </Button>
            ))}
          </div>
        </div>
      )}
      
      <Button
        size="lg"
        className="rounded-full h-12 w-12 shadow-lg bg-blue-600 hover:bg-blue-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Users className="h-6 w-6" />
      </Button>
    </div>
  );
}