import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

const decorate = withStyles({
  navItemText: {
    marginLeft: 8
  },
})

const NavItem = decorate<{ text: string, icon: React.ComponentType, onClick: React.MouseEventHandler<HTMLElement> }>(({ classes, text, icon: Icon, onClick }) => {
  return (
    <ListItem button={true} onClick={onClick}>
      <Icon />
      <ListItemText className={classes.navItemText} primary={text} />
    </ListItem>)
})

export default NavItem
