import MenuIcon from '@material-ui/icons/Menu'
import MuiAppBar from '@material-ui/core/AppBar'
import List from '@material-ui/core/List'
import IconButton from '@material-ui/core/IconButton'
import { withStyles, WithStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import * as React from 'react'
import { app } from '../Api/Auth'
import Drawer from '@material-ui/core/Drawer'
import * as classNames from 'classnames'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import AnnouncementIcon from '@material-ui/icons/Announcement'
import HomeIcon from '@material-ui/icons/Home'
import SubjectIcon from '@material-ui/icons/Subject'
import { Redirect, RouteComponentProps } from 'react-router'
import NavItem from './NavItem'
import Divider from '@material-ui/core/Divider'

const drawerWidth = 240

const decorate = withStyles(theme => ({
  flex: {
    flex: 1,
  },
  root: {
    // flexGrow: 1,
    '&~div': { // for pages on stage
      marginTop: 64,
      flex: 1,
      overflow: 'auto'
    },
    '& > div': { // Hack sidebar height
      height: '100%'
    }
  },
  right: {
    marginRight: '2em',
    cursor: 'pointer'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },

  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative' as 'relative',
    whiteSpace: 'nowrap' as 'nowrap',
    width: drawerWidth,
    height: '100%',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden' as 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  toolbar: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'strech',
    // justifyContent: 'flex-end',
    // padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  hideButton: {
    height: 48,
    width: 48,
    margin: 8
  }
}), { withTheme: true })

const AppBar = decorate<{}>(
  class extends React.PureComponent<
    RouteComponentProps<{}> &
    WithStyles<'flex' | 'root' | 'right' | 'appBar' | 'appBarShift' | 'menuButton' | 'hide' | 'drawerPaper' | 'drawerPaperClose' | 'toolbar' | 'hideButton'>,
    { open: boolean }
    >{
    public state = {
      open: false
    }

    private handleDrawerOpen = () => {
      this.setState({ open: true })
    }

    private handleDrawerClose = () => {
      this.setState({ open: false })
    }

    private onLogout = async () => {
      await app.auth().signOut()
      this.props.history.push('/login')
    }

    private navTo = (dest: string) => (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault()
      this.props.history.push(dest)
    }

    private navToHome = this.navTo('/')
    private navToAnnouncement = this.navTo('/announcement')
    private navToNews = this.navTo('/news')

    public render () {
      const { root, flex, right, menuButton, appBar, appBarShift, hide, drawerPaper, drawerPaperClose, toolbar, hideButton } = this.props.classes
      const { theme, location } = this.props
      const user = app.auth().currentUser
      if (user === null) {
        return <Redirect to={{ pathname: "/login" , state: {
          oldLocation: location.pathname
        } }} />
      }
      return (
        <div className={root}>
          {/* <TaskManagerUI /> */}
          <MuiAppBar
            position="fixed"
            className={classNames(appBar, this.state.open && appBarShift)}
          >
            <Toolbar disableGutters={!this.state.open}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(menuButton, this.state.open && hide)}
              >
                <MenuIcon />
              </IconButton>
              <Typography className={flex} variant="title" color="inherit" noWrap={true}>
                X Panel
              </Typography>
              <Typography onClick={this.onLogout} className={right} variant="subheading" color="inherit">
                {user ? 'Hello, ' + user.displayName : ''}
              </Typography>
            </Toolbar>
          </MuiAppBar>
          <Drawer
            variant="permanent"
            classes={{
              paper: classNames(drawerPaper, !this.state.open && drawerPaperClose),
            }}
            open={this.state.open}
          >
            <div className={toolbar}>
              <IconButton className={hideButton} onClick={this.handleDrawerClose}>
                {theme!.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
              <List>
                <NavItem icon={HomeIcon} text="Home" onClick={this.navToHome} />
                <NavItem icon={AnnouncementIcon} text="Announcement" onClick={this.navToAnnouncement} />
                <NavItem icon={SubjectIcon} text="News" onClick={this.navToNews} />
                {/* <NavItem icon={PermissionIcon} text="Permission" onClick={this.navToPermission} /> */}
                {/* <NavItem icon={SubjectIcon} text="calendar" onClick={this.navToCalendar} /> */}
                {/* <NavItem icon={PublictalkIcon} text="PublicTalk" onClick={this.navToPublictalk} /> */}
                <Divider />
                {/* <NavItem icon={UnarchiveIcon} text="Import" onClick={this.navToImport} /> */}
              </List>
            </div>
          </Drawer>
        </div>)
    }
  }
)

export default AppBar
