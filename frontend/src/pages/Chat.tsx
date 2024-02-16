import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ChatItem from "../components/chat/ChatItem";
import DeleteModal from "../components/chat/DeleteModal";
import { Box, IconButton } from "@mui/material";
import {
  deleteUserChats,
  getUserChats,
  sendChatRequest,
} from "../helpers/api-communicator";
import toast from "react-hot-toast";
import { BiLoader } from "react-icons/bi";
import { IoMdSend } from "react-icons/io";
import { FaArrowDown } from "react-icons/fa";
type Message = {
  role: "user" | "model";
  parts: string;
};
const Chat = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const handleSubmit = async () => {
    const content = inputRef.current?.value as string;
    if (inputRef && inputRef.current) {
      inputRef.current.value = "";
    }
    try {
      setIsLoading(true);
      const newMessage: Message = { role: "user", parts: content };
      setChatMessages((prev) => [...prev, newMessage]);
      const chatData = await sendChatRequest(content);
      setChatMessages((prev) => [...prev, chatData.chats]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChats = async () => {
    try {
      toast.loading("Deleting Chats", { id: "deletechats" });
      await deleteUserChats();
      setChatMessages([]);
      toast.success("Deleted Chats Successfully", { id: "deletechats" });
    } catch (error) {
      console.log(error);
      toast.error("Deleting chats failed", { id: "deletechats" });
    }
  };

  const scrollToBottom = () => {
    if (chatContainerRef?.current) {
      chatContainerRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  useLayoutEffect(() => {
    const fetch = async () => {
      const data = await getUserChats();
      setChatMessages([...data.chats]);
    };
    if (auth?.isLoggedIn && auth?.user) {
      try {
        setIsLoading(true);
        toast.loading("Loading Chats", { id: "loadchats" });
        fetch();
        toast.success("Successfully loaded chats", { id: "loadchats" });
      } catch (error) {
        console.log(error);
        toast.error("Loading Failed", { id: "loadchats" });
      } finally {
        setIsLoading(false);
      }
    }
  }, [auth]);

  useEffect(() => {
    if (!auth?.user) {
      return navigate("/login");
    }
  }, [auth]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages.length]);

  useEffect(() => {
    const handleScroll = () => {
      const container = chatRef.current;
      if (container) {
        const isNotAtBottom =
          container.scrollTop + container.clientHeight <
          container.scrollHeight - 10;
        setShowButton(isNotAtBottom);
      }
    };

    const container = chatRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        minWidth: "100%",
        flex: { md: 0.8, xs: 0, sm: 0 },
        flexDirection: "column",
        px: { md: 3, xs: 1, sm: 1 },
        gap: 1,
        mt: 1,
        position: "relative",
      }}
    >
      <DeleteModal
        setOpen={setOpen}
        open={open}
        handleDeleteChats={handleDeleteChats}
      />

      <Box
        sx={{
          maxWidth: "100%",
          height: "68vh",
          position: "relative",
          px: { md: "120px", sm: "2px" },
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          scrollbarWidth: "12px",
          scrollbarColor: "rgb(17,67,69) transparent",
          overflowY: "auto",
          scrollBehavior: "smooth",
        }}
        ref={chatRef}
      >
        {chatMessages.length > 0 &&
          chatMessages?.map((chat, index) => (
            <ChatItem parts={chat.parts} role={chat.role} key={index} />
          ))}

        {isLoading && (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              marginTop: "4px",
            }}
          >
            <BiLoader size={32} color="white" className="rotate" />
          </div>
        )}

        <div ref={chatContainerRef}></div>
      </Box>
      {showButton && (
        <div
          onClick={scrollToBottom}
          style={{
            zIndex: "99",
            position: "absolute",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            borderRadius: "100px",
            bottom: "15%",
            left: "48%",
            backgroundColor: "rgb(17,27,39)",
          }}
        >
          <FaArrowDown size={18} color="white" />
        </div>
      )}
      <Box
        sx={{
          maxWidth: "100%",
          display: "flex",
          px: { md: "120px", sm: "2px" },
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            borderRadius: 4,
            backgroundColor: "rgb(17,27,39)",
          }}
        >
          <input
            type="text"
            ref={inputRef}
            style={{
              width: "100%",
              padding: "30px",
              border: "none",
              outline: "none",
              color: "white",
              backgroundColor: "transparent",
              fontSize: "20px",
            }}
          />
          <IconButton onClick={handleSubmit} sx={{ color: "white", mx: 1 }}>
            <IoMdSend />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
