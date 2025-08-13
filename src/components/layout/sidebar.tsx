"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Home,
  FolderOpen,
  Users,
  Mail,
  Handshake,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Gift,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { data: session } = useSession();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const userName = session?.user?.name || "Guest";
  const userEmail = session?.user?.email || "No email";
  const userImage = session?.user?.image || "/avatar.png";

  return (
    <aside
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } bg-background transition-all duration-300 flex flex-col h-full pb-4 border-r`}
    >
      {/* Logo + Collapse Button */}
      <div className="flex justify-between items-center gap-2 p-4 pr-0">
        <Image src="/logo.png" alt="logo" width={36} height={36} />
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:flex hidden"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </Button>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1">
        <ul className="space-y-2 p-2">
          <li>
            <Link
              href="/dashboard"
              className={`flex items-center p-2 rounded-lg hover:bg-accent ${
                isCollapsed ? "justify-center" : "space-x-3"
              }`}
            >
              <Home size={20} />
              {!isCollapsed && <span>Home</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/donations"
              className={`flex items-center p-2 rounded-lg hover:bg-accent ${
                isCollapsed ? "justify-center" : "space-x-3"
              }`}
            >
              <Gift size={20} />
              {!isCollapsed && <span>Donations</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/research-needs"
              className={`flex items-center p-2 rounded-lg hover:bg-accent ${
                isCollapsed ? "justify-center" : "space-x-3"
              }`}
            >
              <Users size={20} />
              {!isCollapsed && <span>Research Needs</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/collaboration-requests"
              className={`flex items-center p-2 rounded-lg hover:bg-accent ${
                isCollapsed ? "justify-center" : "space-x-3"
              }`}
            >
              <Handshake size={20} />
              {!isCollapsed && <span>Collaboration Requests</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/messages"
              className={`flex items-center p-2 rounded-lg hover:bg-accent ${
                isCollapsed ? "justify-center" : "space-x-3"
              }`}
            >
              <Mail size={20} />
              {!isCollapsed && <span>Messages</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/settings"
              className={`flex items-center p-2 rounded-lg hover:bg-accent ${
                isCollapsed ? "justify-center" : "space-x-3"
              }`}
            >
              <Settings size={20} />
              {!isCollapsed && <span>Settings</span>}
            </Link>
          </li>
          <li>
            <Link
              href="/help"
              className={`flex items-center p-2 rounded-lg hover:bg-accent ${
                isCollapsed ? "justify-center" : "space-x-3"
              }`}
            >
              <HelpCircle size={20} />
              {!isCollapsed && <span>Help</span>}
            </Link>
          </li>
        </ul>
      </nav>

      {/* User Info + Logout */}
      <div className="p-4 border-t">
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "space-x-3"
          }`}
        >
          <Avatar>
            <AvatarImage src={userImage} alt={userName} />
            <AvatarFallback>
              {userName?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{userName}</p>
              <p className="text-muted-foreground text-xs truncate">
                {userEmail}
              </p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          onClick={async () => await signOut()}
          size="sm"
          className={`mt-2 text-left w-fit ${isCollapsed ? "p-2" : ""}`}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </aside>
  );
};
