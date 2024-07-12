"use client";

import React from "react";
import {
  IconButton,
  Box,
  BoxProps,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FaLinkedin, FaGithub, FaGlobe } from "react-icons/fa";
import Link from "next/link";

interface SocialMediaIconsProps extends BoxProps {
  showFeedback?: boolean;
}

const SocialMediaIcons: React.FC<SocialMediaIconsProps> = ({
  showFeedback = false,
  ...props
}) => {
  const writingMode = useBreakpointValue({
    base: "horizontal-tb",
    md: "vertical-rl",
  }) as "horizontal-tb" | "vertical-rl";
  const textOrientation = useBreakpointValue({ base: "unset", md: "mixed" }) as
    | "unset"
    | "mixed";
  const feedbackLink =
    "https://mail.google.com/mail/?view=cm&fs=1&to=rrbahar@berkeley.edu&su=Blackjack-Sim%20Feedback";

  return (
    <Box
      display="flex"
      flexDirection={{ base: "column", md: "row" }}
      alignItems="center"
      {...props}
    >
      <Box
        display="flex"
        flexDirection={{ base: "row", md: "column" }}
        gap={4}
        alignItems="center"
      >
        <IconButton
          aria-label="Website"
          icon={<FaGlobe />}
          onClick={() => window.open("https://www.ralfibahar.com", "_blank")}
        />
        <IconButton
          aria-label="LinkedIn"
          icon={<FaLinkedin />}
          onClick={() =>
            window.open("https://www.linkedin.com/in/ralfi-bahar/", "_blank")
          }
        />
        <IconButton
          aria-label="GitHub"
          icon={<FaGithub />}
          onClick={() => window.open("https://github.com/RalfiBahar", "_blank")}
        />
      </Box>
      {showFeedback && (
        <Box
          mt={{ base: 2, md: 0 }}
          ml={{ base: 0, md: 4 }}
          style={{
            writingMode,
            textOrientation,
          }}
        >
          <Text textAlign="center" className="text-[#EDF2F6]">
            <Link href={feedbackLink}>Leave Feedback?</Link>
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default SocialMediaIcons;
