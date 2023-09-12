import { Box, Typography } from "@mui/material";
import { IconGridDots } from "@tabler/icons-react";

interface AppButtonProps {
    child: any,
    onClick:()=>void
}


const AppButton = (props: AppButtonProps) => {
    return (<Box
        marginLeft={'10px'}
        width={40}
        height={35}
        bgcolor="primary.light"
        display="flex"
        alignItems="center"
        justifyContent="center"
        onClick ={props.onClick}
    >
        {props.child}
    </Box>);


}


export default AppButton;