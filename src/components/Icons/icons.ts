import IC_AllLink from './svgs/all_link.svg';
import IC_ArrowdropDown from './svgs/arrowdrop_down.svg';
import IC_ArrowdropLeft from './svgs/arrowdrop_left.svg';
import IC_ArrowdropRight from './svgs/arrowdrop_right.svg';
import IC_ArrowdropUp from './svgs/arrowdrop_up.svg';
import IC_Backward from './svgs/backward.svg';
import IC_Chat from './svgs/chat.svg';
import IC_Close from './svgs/close.svg';
import IC_Complete from './svgs/complete.svg';
import IC_Copy from './svgs/copy.svg';
import IC_Down from './svgs/down.svg';
import IC_Download from './svgs/download.svg';
import IC_Error from './svgs/error.svg';
import IC_Forward from './svgs/forward.svg';
import IC_Info from './svgs/info.svg';
import IC_LinkAdd from './svgs/link_add.svg';
import IC_LinkOpen from './svgs/link_open.svg';
import IC_MoreHori from './svgs/more_hori.svg';
import IC_MoreVert from './svgs/more_vert.svg';
import IC_Regenerate from './svgs/regenerate.svg';
import IC_SendFilled from './svgs/send_filled.svg';
import IC_SendOutline from './svgs/send_outline.svg';
import IC_SidenavOpen from './svgs/sidenav_open.svg';
import IC_StopFilled from './svgs/stop_filled.svg';
import IC_StopOutline from './svgs/stop_outline.svg';
import IC_SumGenerate from './svgs/sum_generate.svg';
import IC_ThumbDownFilled from './svgs/thumb_down_filled.svg';
import IC_ThumbDownOutline from './svgs/thumb_down_outline.svg';
import IC_ThumbUpFilled from './svgs/thumb_up_filled.svg';
import IC_ThumbUpOutline from './svgs/thumb_up_outline.svg';
import IC_Undo from './svgs/undo.svg';
import IC_Up from './svgs/up.svg';
import IC_Warning from './svgs/warning.svg';

export const IconMap = {
  IC_AllLink,
  IC_ArrowdropDown,
  IC_ArrowdropLeft,
  IC_ArrowdropRight,
  IC_ArrowdropUp,
  IC_Backward,
  IC_Chat,
  IC_Close,
  IC_Complete,
  IC_Copy,
  IC_Down,
  IC_Download,
  IC_Error,
  IC_Forward,
  IC_Info,
  IC_LinkAdd,
  IC_LinkOpen,
  IC_MoreHori,
  IC_MoreVert,
  IC_Regenerate,
  IC_SendFilled,
  IC_SendOutline,
  IC_SidenavOpen,
  IC_StopFilled,
  IC_StopOutline,
  IC_SumGenerate,
  IC_ThumbDownFilled,
  IC_ThumbDownOutline,
  IC_ThumbUpFilled,
  IC_ThumbUpOutline,
  IC_Undo,
  IC_Up,
  IC_Warning,
} as const;

export type IconMapTypes = keyof typeof IconMap;

export const IconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
} as const;

export type IconSizeTypes = keyof typeof IconSizes;
