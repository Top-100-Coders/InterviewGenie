"use client";
import Image from "next/image";
import logo from "../public/ai-logo.svg";
import TypeIt from "typeit-react";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  // const stringSplitter = (string) => {
  //   const splitter = new GraphemeSplitter();
  //   return splitter.splitGraphemes(string);
  // };
  const [value, setValue] = useState("");
  const [message, setMessage] = useState(null);
  const [prevChats, setPrevChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState([]);
  const [role,setRole]=useState('')

  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }

    if (currentTitle && value && message) {
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          title: currentTitle,
          role: "user",
          content: value,
        },
        {
          title: currentTitle,
          role: message.role,
          content: message.content,
        },
      ]);
    }
  }, [message, currentTitle, value]);

  const token = process.env.TOKEN;

  const chat = async () => {
    const inputValue = inputRef.current.value;
    const token = process.env.TOKEN;
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: inputValue,
        role
      }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    try {
      const resp = await fetch("http://localhost:5005/questions", options);
      const data = await resp.json();
      setMessage(data.choices[0].message);
      setValue(inputValue);
      console.log(data);
    } catch (error) {
      console.log(error);
    }

    inputRef.current.value = ""

  };

  const currentChat = prevChats.filter(
    (prevChat) => prevChat.title === currentTitle
  );
  console.log(currentChat.length, "cht");

  
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      console.log("CCCCC");
      container.scrollTop = container.scrollHeight;
    }
  }, [prevChats]);


const handleKeyPress = (event) => {
  if(event.key === "Enter") {
    event.preventDefault();
    chat()
  }
  }
  const handleChange = (e)=>{
    setValue(e.target.value)
  }
  console.log(role);
  return (
    <main className="flex flex-col items-center max-h-min " ref={containerRef}>
      <div className="flex flex-col space-y-5 justify-center items-center mt-[15rem]">
        <Image src={logo} alt="AI LOGO" width={100} />
        {currentChat.length === 0 && (
          <>
            <input
              type="text"
              placeholder="ARE YOU READY? "
              className="px-3 py-1 rounded-lg"
              value={value}
              onChange={handleChange}
              // onKeyDown={chat}
              ref={inputRef}
            />
            <button
              type="submit"
              className="rounded-[10px] text-white bg-[#375ac1] hover:bg-[#3766f28e] px-4 py-2"
              // onKeyDown={chat}
              onClick={chat}
            >
              START INTERVIEW
            </button>
          </>
        )}
      </div>

      <div className="mb-[15rem] w-[90%] flex flex-col justify-center items-center">
        {currentChat.map((chatMessage, index) => (
          <>
            <span className="text-white ml-[5rem] self-start mt-10 ">
              {chatMessage.role}
            </span>
            <div className="w-[90%] text-white bg-[#375ac1] h-auto p-10 rounded-lg  ">
              {chatMessage.role === "user" ? (
                <TypeIt options={{ speed: 0, cursor: false }}>
                  {chatMessage.content}
                </TypeIt>
              ) : (
                <TypeIt options={{ speed: 50, cursor: false }}>
                  {chatMessage.content}
                </TypeIt>
              )}
            </div>
          </>
        ))}
      </div>

      {currentChat.length > 0 && (
        <div className="flex justify-center fixed bottom-10 w-[95%] space-x-7">
          <input
            type="text"
            ref={inputRef}
            className="w-[80%] self-start rounded-lg px-2 py-3"
            placeholder="Type your answer !"
          />
          <button
            className="rounded-[10px] text-gray bg-white hover:bg-white px-4 py-2"
            onClick={chat}
          >
            &gt;
          </button>
        </div>
      )}
    </main>
  );
}
