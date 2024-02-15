import { Box, IconButton } from "@mui/material";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { useAuth } from "../context/AuthContext";
import ChatItem from "../components/chat/ChatItem";
import { useNavigate } from "react-router-dom";
import {
  deleteUserChats,
  getUserChats,
  sendChatRequest,
} from "../helpers/api-communicator";
import toast from "react-hot-toast";
import { BiLoader } from "react-icons/bi";
import DeleteModal from "../components/chat/DeleteModal";
type Message = {
  role: "user" | "model";
  parts: string;
};
const Chat = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const auth = useAuth();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
      console.log("chatData =>", chatData);
      setChatMessages([...chatData.chats]);
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

  const scrollToBottom = () => {
    if (chatContainerRef?.current) {
      chatContainerRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages.length]);

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
          overflow: "scroll",
          overflowX: "hidden",
          overflowY: "auto",
          scrollBehavior: "smooth",
        }}
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
