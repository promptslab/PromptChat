import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

async function copyTextToClipboard(text) {
    if ('clipboard' in navigator) {
        return await navigator.clipboard.writeText(text);
    } else {
        return document.execCommand('copy', true, text);
    }
}

export const copyToClipboard = (event, text) => {
    event.stopPropagation()
    event.preventDefault()
    copyTextToClipboard(text).then(res => {
        // console.log('copied', res)
        
    })
};

export default function CopyContent({tooltip = 'copy text', className = "", copyText = ""}) {
    return (
    <>
        <Tooltip title={tooltip}>
            <IconButton color="primary" onClick={e => copyToClipboard(e, copyText)} className={className}>
                <ContentCopyIcon />
            </IconButton>
        </Tooltip>
    </>
    )
}