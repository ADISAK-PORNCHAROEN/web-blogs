import type { SxProps, Theme } from "@mui/material/styles";

export const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
};

export const createExcerpt = (html: string, maxLength = 180): string => {
  const text = stripHtml(html);
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trimEnd()}…`;
};

export const articleHtmlSx: SxProps<Theme> = {
  color: "text.primary",
  fontSize: "1.0625rem",
  lineHeight: 1.85,
  "& p": {
    mt: 0,
    mb: 2,
    fontSize: "1.0625rem",
    lineHeight: 1.85,
    color: "text.primary",
  },
  "& p:last-of-type": {
    mb: 0,
  },
  "& h1, & h2, & h3, & h4": {
    fontWeight: 800,
    lineHeight: 1.25,
    letterSpacing: "-0.025em",
    color: "text.primary",
    mt: 4,
    mb: 1.5,
  },
  "& h1": {
    fontSize: "2.25rem",
  },
  "& h2": {
    fontSize: "1.75rem",
  },
  "& h3": {
    fontSize: "1.375rem",
  },
  "& h4": {
    fontSize: "1.125rem",
  },
  "& ul, & ol": {
    pl: 3,
    mb: 2,
    mt: 0,
  },
  "& li": {
    mb: 0.75,
  },
  "& blockquote": {
    m: 0,
    mb: 2,
    pl: 2,
    borderLeft: "4px solid",
    borderColor: "secondary.main",
    color: "text.secondary",
    fontStyle: "italic",
  },
  "& img": {
    display: "block",
    width: "100%",
    height: "auto",
    borderRadius: 3,
    my: 2.5,
  },
  "& .image": {
    display: "table",
    clear: "both",
    margin: "1.5rem auto",
    maxWidth: "100%",
  },
  "& .image-inline": {
    display: "inline-block",
  },
  "& .image-style-side": {
    float: "right",
    marginLeft: "1.5rem",
    maxWidth: "50%",
  },
  "& .image-style-align-left": {
    float: "left",
    marginRight: "1.5rem",
    maxWidth: "50%",
  },
  "& .image-style-align-right": {
    float: "right",
    marginLeft: "1.5rem",
    maxWidth: "50%",
  },
  "& .image-style-align-center": {
    margin: "1.5rem auto",
    display: "block",
    textAlign: "center",
  },
  "&::after": {
    content: '""',
    display: "block",
    clear: "both",
  },
  "& a": {
    color: "secondary.main",
    textDecorationColor: "currentColor",
  },
  "& pre": {
    p: 2,
    borderRadius: 2,
    overflowX: "auto",
    bgcolor: "action.hover",
    fontFamily: "var(--font-geist-mono), monospace",
    fontSize: "0.875rem",
  },
  "& code": {
    fontFamily: "var(--font-geist-mono), monospace",
    fontSize: "0.875em",
    bgcolor: "action.hover",
    px: 0.75,
    py: 0.25,
    borderRadius: 1,
  },
};
