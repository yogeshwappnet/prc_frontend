import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import { NavLink } from 'react-router-dom';

export const mainListItems = (


  <React.Fragment>
    <ListItemButton  component={NavLink}
                    to={"/dashboard"}>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Campaigns" />
    </ListItemButton>
    <ListItemButton component={NavLink}
                    to={"/dashboard/conversations"}>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Conversations" />
    </ListItemButton>
  </React.Fragment>
);
