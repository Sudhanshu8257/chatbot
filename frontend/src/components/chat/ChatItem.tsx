import React, { useRef } from "react";
import { Box, Avatar,  } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import Markdown from "markdown-to-jsx";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import html from "highlight.js/lib/languages/xml"; // HTML
import css from "highlight.js/lib/languages/css";
import java from "highlight.js/lib/languages/java";
import cpp from "highlight.js/lib/languages/cpp";
import ruby from "highlight.js/lib/languages/ruby";
import php from "highlight.js/lib/languages/php";
import typescript from "highlight.js/lib/languages/typescript";

const ChatItem = ({
  parts,
  role,
}: {
  parts: string;
  role: "user" | "model";
}) => {
  hljs.registerLanguage("javascript", javascript);
  hljs.registerLanguage("python", python);
  hljs.registerLanguage("html", html);
  hljs.registerLanguage("css", css);
  hljs.registerLanguage("java", java);
  hljs.registerLanguage("cpp", cpp);
  hljs.registerLanguage("ruby", ruby);
  hljs.registerLanguage("php", php);
  hljs.registerLanguage("typescript", typescript);
  function SyntaxHighlightedCode(props) {
    const ref = useRef<HTMLElement | null>(null);

    React.useEffect(() => {
      if (ref.current && props.className?.includes("lang-") && hljs) {
        hljs.highlightElement(ref.current);

        // hljs won't reprocess the element unless this attribute is removed
        ref.current.removeAttribute("data-highlighted");
      }
    }, [props.className, props.children]);

    return <code {...props} ref={ref} />;
  }

  const auth = useAuth();
  return role == "model" ? (
    <Box
      sx={{
        display: "flex",
        p: 2,
        bgcolor: "#004d5612",
        gap: 2,
        borderRadius: 2,
        my: 2,
      }}
    >
      <Avatar sx={{ ml: "0" }}>
        <img src="openai.png" alt="openai" width={"30px"} />
      </Avatar>
      <Box textAlign={"left"} overflow={"auto"}>
        <Markdown
          options={{
            wrapper: "div",
            overrides: {
              code: SyntaxHighlightedCode,
            },
          }}
        >
          {parts}
        </Markdown>
      </Box>
    </Box>
  ) : (
    <Box
      sx={{
        display: "flex",
        p: 2,
        bgcolor: "rgba(0, 77, 86, 0.5)",
        gap: 2,
        borderRadius: 2,
      }}
    >
      <Avatar sx={{ ml: "0", bgcolor: "black", color: "white" }}>
        {auth?.user?.name[0]}

        {auth?.user?.name?.includes(" ") && auth?.user?.name?.split(" ")[1][0]}
      </Avatar>
      <Box textAlign={"left"}>
        <Markdown
          options={{
            wrapper: "div",
            overrides: {
              code: SyntaxHighlightedCode,
            },
          }}
        >
          {parts}
        </Markdown>
      </Box>
    </Box>
  );
};

export default ChatItem;
