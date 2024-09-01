import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Paper } from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import PoliticsIcon from '@mui/icons-material/AccountBalance';
import EntertainmentIcon from '@mui/icons-material/Movie';
import TechnologyIcon from '@mui/icons-material/Computer';
import OtherIcon from '@mui/icons-material/MoreHoriz';

interface SidebarProps {
  onCategorySelect: (category: string | null) => void;
}

const categories = [
  { name: 'All', icon: <OtherIcon />, value: null },
  { name: 'Sports', icon: <SportsSoccerIcon />, value: 'sports' },
  { name: 'Politics', icon: <PoliticsIcon />, value: 'politics' },
  { name: 'Entertainment', icon: <EntertainmentIcon />, value: 'entertainment' },
  { name: 'Technology', icon: <TechnologyIcon />, value: 'technology' },
  { name: 'Other', icon: <OtherIcon />, value: 'other' },
];

const Sidebar: React.FC<SidebarProps> = ({ onCategorySelect }) => {
  return (
    <Paper elevation={3}>
      <List>
        {categories.map((category) => (
          <ListItem
            button
            key={category.name}
            onClick={() => onCategorySelect(category.value)}
          >
            <ListItemIcon>{category.icon}</ListItemIcon>
            <ListItemText primary={category.name} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default Sidebar;
