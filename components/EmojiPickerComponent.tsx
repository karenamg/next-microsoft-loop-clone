import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import React, { ReactNode, useState } from "react";

interface EmojiPickerProps {
  children: ReactNode;
  setEmojiIcon: (cover: string) => void;
}

function EmojiPickerComponent({ children, setEmojiIcon }: EmojiPickerProps) {
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  return (
    <div>
      <div onClick={() => setOpenEmojiPicker(true)}>{children}</div>
      {openEmojiPicker && (
        <div className="absolute z-10">
          <EmojiPicker
            emojiStyle={EmojiStyle.NATIVE}
            onEmojiClick={(e) => {
              setEmojiIcon(e.emoji);
              setOpenEmojiPicker(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default EmojiPickerComponent;
