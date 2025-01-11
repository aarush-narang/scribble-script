'use client'
import { Button, useMantineColorScheme } from "@mantine/core";
import UploadPage from "./upload/page";
import { useState, useEffect } from "react";
import CodeMirrorEditor from "@/components/editor/CodeMirrorEditor";
import { useImage } from "@/components/editor/ImageContext";
import Navbar from "@/components/eye candy/Navbar";
import { IconSun, IconMoonStars } from "@tabler/icons-react";
import Link from 'next/link';

export default function Home() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const [initialCode, setInitialCode] = useState<string>("// Write your code here...");
  const { base64Image, setBase64Image } = useImage();
  const [extract, setExtract] = useState<boolean>(false);

  // Ensure the color scheme is set to 'light' by default
  useEffect(() => {
    if (!colorScheme) {
      toggleColorScheme('light');
    }
  }, [colorScheme, toggleColorScheme]);

  return (
    <div>
      <Navbar colorScheme={colorScheme}>
      </Navbar>
      <div className="ml-4">
        <UploadPage setExtract={setExtract} setBase64Image={setBase64Image}></UploadPage>

      </div>
      <Button 
        onClick={() => toggleColorScheme()} 
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {colorScheme === 'dark' ? <IconSun size={20} /> : <IconMoonStars size={20} />}
      </Button>
      <style jsx>{`
        .home-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}