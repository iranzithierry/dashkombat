"use client"

import { createContext, use, useCallback, useEffect, useMemo, useState } from "react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/lib/utils/hooks/use-media-query"
import { IconChevronLgLeft, IconHamburger, IconSidebarFill } from "justd-icons"
import type {
  ButtonProps,
  DisclosureGroupProps,
  DisclosureProps,
  LinkProps,
  LinkRenderProps,
} from "react-aria-components"
import {
  Disclosure,
  DisclosureGroup,
  DisclosurePanel,
  Header,
  Heading,
  Link,
  Text,
  Button as Trigger,
  composeRenderProps,
} from "react-aria-components"
import { twJoin } from "tailwind-merge"
import { tv } from "tailwind-variants"
import { Badge } from "./badge"
import { Button } from "./button"
import { composeTailwindRenderProps } from "./primitive"
import { Separator, type SeparatorProps } from "./separator"
import { Sheet } from "./sheet"
import { Tooltip } from "./tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_KEYBOARD_SHORTCUT = "b"
type SidebarContextProps = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  isOpenOnMobile: boolean
  setIsOpenOnMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = createContext<SidebarContextProps | null>(null)

const useSidebar = () => {
  const context = use(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a Sidebar.")
  }

  return context
}

interface SidebarProviderProps extends React.ComponentProps<"div"> {
  defaultOpen?: boolean
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

const SidebarProvider = ({
  defaultOpen = true,
  isOpen: openProp,
  onOpenChange: setOpenProp,
  className,
  children,
  ref,
  ...props
}: SidebarProviderProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [openMobile, setOpenMobile] = useState(false)

  const [internalOpenState, setInternalOpenState] = useState(defaultOpen)
  const open = openProp ?? internalOpenState
  const setOpen = useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value

      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        setInternalOpenState(openState)
      }

      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    },
    [setOpenProp, open],
  )

  const toggleSidebar = useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open)
  }, [isMobile, setOpen])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleSidebar])

  const state = open ? "expanded" : "collapsed"

  const contextValue = useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      isOpenOnMobile: openMobile,
      setIsOpenOnMobile: setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, toggleSidebar],
  )

  return (
    <SidebarContext value={contextValue}>
      <div
        className={cn(
          "@container **:data-[slot=icon]:shrink-0",
          "[--sidebar-width-dock:3.25rem] [--sidebar-width-mobile:18rem] [--sidebar-width:17rem]",
          "[--sidebar-border:color-mix(in_oklch,var(--color-sidebar)_25%,black_6%)]",
          "dark:[--sidebar-border:color-mix(in_oklch,var(--color-sidebar)_55%,white_10%)]",
          "[--sidebar-accent:color-mix(in_oklab,var(--color-sidebar)_95%,black_5%)]",
          "dark:[--sidebar-accent:color-mix(in_oklab,var(--color-sidebar)_90%,white_10%)]",
          "flex min-h-svh w-full text-sidebar-fg",
          "group/sidebar-root has-data-[sidebar-intent=inset]:bg-sidebar dark:has-data-[sidebar-intent=inset]:bg-bg",
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    </SidebarContext>
  )
}

const gap = tv({
  base: [
    "w-(--sidebar-width) group-data-[sidebar-collapsible=hidden]/sidebar-container:w-0",
    "relative h-svh bg-transparent transition-[width] duration-200 ease-linear",
    "group-data-[sidebar-side=right]/sidebar-container:rotate-180",
  ],
  variants: {
    intent: {
      default: "group-data-[sidebar-collapsible=dock]/sidebar-container:w-(--sidebar-width-dock)",
      fleet: "group-data-[sidebar-collapsible=dock]/sidebar-container:w-(--sidebar-width-dock)",
      float:
        "group-data-[sidebar-collapsible=dock]/sidebar-container:w-[calc(var(--sidebar-width-dock)+theme(spacing.4))]",
      inset:
        "group-data-[sidebar-collapsible=dock]/sidebar-container:w-[calc(var(--sidebar-width-dock)+theme(spacing.2))]",
    },
  },
})

const sidebar = tv({
  base: [
    "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
    "min-h-svh bg-sidebar",
    "**:data-[slot=disclosure]:border-0 **:data-[slot=disclosure]:px-2",
  ],
  variants: {
    side: {
      left: "left-0 group-data-[sidebar-collapsible=hidden]/sidebar-container:left-[calc(var(--sidebar-width)*-1)]",
      right:
        "right-0 group-data-[sidebar-collapsible=hidden]/sidebar-container:right-[calc(var(--sidebar-width)*-1)]",
    },
    intent: {
      float:
        "bg-bg p-2 group-data-[sidebar-collapsible=dock]/sidebar-container:w-[calc(var+theme(spacing.4)+2px)]",
      inset: [
        "bg-sidebar p-2 group-data-[sidebar-collapsible=dock]/sidebar-container:w-[calc(var(--sidebar-width-dock)+theme(spacing.2)+2px)] dark:bg-bg",
      ],
      fleet: [
        "group-data-[sidebar-collapsible=dock]/sidebar-container:w-(--sidebar-width-dock)",
        "**:data-sidebar-disclosure:gap-y-0 **:data-sidebar-section:gap-y-0 **:data-sidebar-disclosure:px-0 **:data-sidebar-section:px-0",
        "group-data-[sidebar-side=left]/sidebar-container:border-r group-data-[sidebar-side=right]/sidebar-container:border-l",
      ],
      default: [
        "group-data-[sidebar-collapsible=dock]/sidebar-container:w-(--sidebar-width-dock) group-data-[sidebar-side=left]/sidebar-container:border-(--sidebar-border)",
        "group-data-[sidebar-side=left]/sidebar-container:border-r group-data-[sidebar-side=right]/sidebar-container:border-l",
      ],
    },
  },
})

interface SidebarProps extends React.ComponentProps<"div"> {
  intent?: "default" | "float" | "inset" | "fleet"
  collapsible?: "hidden" | "dock" | "none"
  side?: "left" | "right"
  closeButton?: boolean
}

const Sidebar = ({
  closeButton = true,
  collapsible = "hidden",
  side = "left",
  intent = "default",
  className,
  ...props
}: SidebarProps) => {
  const { isMobile, state, isOpenOnMobile, setIsOpenOnMobile } = useSidebar()

  if (collapsible === "none") {
    return (
      <div
        data-sidebar-intent={intent}
        data-sidebar-collapsible="none"
        className={cn(
          "peer flex h-full w-(--sidebar-width) flex-col border-r bg-sidebar text-sidebar-fg ",
          className,
        )}
        {...props}
      />
    )
  }

  if (isMobile) {
    return (
      <Sheet isOpen={isOpenOnMobile} onOpenChange={setIsOpenOnMobile} {...props}>
        <Sheet.Content
          closeButton={closeButton}
          aria-label="Sidebar"
          data-sidebar-intent="default"
          classNames={{
            content: "bg-sidebar w-(--sidebar-width-mobile) text-sidebar-fg [&>button]:hidden",
          }}
          isFloat={intent === "float"}
          side={side}
        >
          <Sheet.Body className="px-0 sm:px-0">{props.children}</Sheet.Body>
        </Sheet.Content>
      </Sheet>
    )
  }

  return (
    <div
      data-sidebar-state={state}
      data-sidebar-collapsible={state === "collapsed" ? collapsible : ""}
      data-sidebar-intent={intent}
      data-sidebar-side={side}
      className="group/sidebar-container peer hidden text-sidebar-fg md:block"
      {...props}
    >
      <div className={gap({ intent })} />
      <div
        className={sidebar({
          side,
          intent,
          className,
        })}
        {...props}
      >
        <div
          data-sidebar="default"
          className={twJoin(
            "flex h-full w-full flex-col text-sidebar-fg",
            "group-data-[sidebar-intent=inset]/sidebar-container:bg-sidebar dark:group-data-[sidebar-intent=inset]/sidebar-container:bg-bg",
            "group-data-[sidebar-intent=float]/sidebar-container:rounded-lg group-data-[sidebar-intent=float]/sidebar-container:border group-data-[sidebar-intent=float]/sidebar-container:border-(--sidebar-border) group-data-[sidebar-intent=float]/sidebar-container:bg-sidebar group-data-[sidebar-intent=float]/sidebar-container:shadow-xs",
          )}
        >
          {props.children}
        </div>
      </div>
    </div>
  )
}

const header = tv({
  base: "mb-2 flex flex-col **:data-[slot=sidebar-label-mask]:hidden",
  variants: {
    collapsed: {
      false: "px-4 py-[calc(var(--spacing)*4)]",
      true: "mt-2 p-5 group-data-[sidebar-intent=float]/sidebar-container:mt-2 md:mx-auto md:size-9 md:items-center md:justify-center md:rounded-lg md:p-0 md:hover:bg-(--sidebar-accent)",
    },
  },
})

const SidebarHeader = ({ className, ref, ...props }: React.ComponentProps<"div">) => {
  const { state } = use(SidebarContext)!
  return (
    <div
      ref={ref}
      data-sidebar-header="true"
      className={header({ collapsed: state === "collapsed", className })}
      {...props}
    />
  )
}

const footer = tv({
  base: [
    "mt-auto flex flex-col p-2",
    "in-data-[sidebar-intent=fleet]:mt-0 in-data-[sidebar-intent=fleet]:p-0",
    "in-data-[sidebar-intent=fleet]:**:data-[slot=menu-trigger]:rounded-none",
    "**:data-[slot=menu-trigger]:relative **:data-[slot=menu-trigger]:overflow-hidden",
    "**:data-[slot=menu-trigger]:rounded-lg",
    "**:data-[slot=menu-trigger]:flex **:data-[slot=menu-trigger]:cursor-default **:data-[slot=menu-trigger]:items-center **:data-[slot=menu-trigger]:gap-x-2 **:data-[slot=menu-trigger]:p-2 **:data-[slot=menu-trigger]:outline-hidden sm:**:data-[slot=menu-trigger]:text-sm",
    "**:data-[slot=menu-trigger]:data-hovered:bg-(--sidebar-accent) **:data-[slot=menu-trigger]:data-hovered:text-fg",
  ],
  variants: {
    collapsed: {
      false: [
        "**:data-[slot=avatar]:*:size-8 **:data-[slot=avatar]:size-8",
        "**:data-[slot=menu-trigger]:**:data-[slot=chevron]:ml-auto **:data-[slot=menu-trigger]:**:data-[slot=chevron]:transition-transform **:data-[slot=menu-trigger]:w-full **:data-[slot=menu-trigger]:data-pressed:**:data-[slot=chevron]:rotate-180",
      ],
      true: [
        "**:data-[slot=avatar]:*:size-6 **:data-[slot=avatar]:size-6",
        "**:data-[slot=chevron]:hidden **:data-[slot=menu-label]:hidden",
        "**:data-[slot=menu-trigger]:grid **:data-[slot=menu-trigger]:size-8 **:data-[slot=menu-trigger]:place-content-center",
      ],
    },
  },
})

const SidebarFooter = ({ className, ...props }: React.ComponentProps<"div">) => {
  const { state, isMobile } = useSidebar()
  const collapsed = state === "collapsed" && !isMobile
  return <div data-sidebar-footer="true" className={footer({ collapsed, className })} {...props} />
}

const SidebarContent = ({ className, ...props }: React.ComponentProps<"div">) => {
  const { state } = useSidebar()
  return (
    <div
      data-sidebar-content="true"
      className={cn(
        "flex min-h-0 flex-1 scroll-mb-96 flex-col overflow-y-auto overflow-x-hidden",
        state === "collapsed" && "items-center",
        className,
      )}
      {...props}
    />
  )
}

const SidebarSectionGroup = ({ className, ...props }: React.ComponentProps<"section">) => {
  const { state, isMobile } = useSidebar()
  const collapsed = state === "collapsed" && !isMobile
  return (
    <section
      data-sidebar-section-group="true"
      className={cn(
        "flex w-full flex-col gap-y-6",
        collapsed && "items-center justify-center",
        className,
      )}
      {...props}
    />
  )
}

const SidebarSection = ({
  className,
  ...props
}: React.ComponentProps<"div"> & { title?: string }) => {
  const { state } = useSidebar()
  return (
    <div
      data-sidebar-section="true"
      className={cn("flex flex-col gap-y-0.5 in-data-[sidebar-intent=fleet]:px-0 px-2", className)}
      {...props}
    >
      {state !== "collapsed" && "title" in props && (
        <Header className="group-data-[sidebar-collapsible=dock]/sidebar-container:-mt-8 mb-1 flex shrink-0 items-center rounded-md px-2.5 font-medium text-sidebar-fg/70 text-xs outline-none ring-sidebar-ring transition-[margin,opa] duration-200 ease-linear data-focus-visible:ring-2 *:data-[slot=icon]:size-4 *:data-[slot=icon]:shrink-0 group-data-[sidebar-collapsible=dock]/sidebar-container:opacity-0">
          {props.title}
        </Header>
      )}
      {props.children}
    </div>
  )
}

const sidebarItem = tv({
  base: [
    "group relative flex w-full cursor-pointer items-center gap-x-2 overflow-hidden rounded-lg px-2.5 py-2 text-sidebar-fg/70 outline-hidden sm:text-sm",
    "**:data-[slot=menu-trigger]:absolute **:data-[slot=menu-trigger]:right-0 **:data-[slot=menu-trigger]:flex **:data-[slot=menu-trigger]:h-full **:data-[slot=menu-trigger]:w-[calc(var(--sidebar-width)-90%)] **:data-[slot=menu-trigger]:items-center **:data-[slot=menu-trigger]:justify-end **:data-[slot=menu-trigger]:pr-2.5",
    "**:data-[slot=menu-trigger]:hidden",
    "**:data-[slot=avatar]:*:size-4 **:data-[slot=avatar]:size-4 **:data-[slot=icon]:size-4 **:data-[slot=avatar]:shrink-0 **:data-[slot=icon]:shrink-0",
    "**:data-[slot=menu-trigger]:bg-gradient-to-l **:data-[slot=menu-trigger]:from-(--sidebar-accent) **:data-[slot=menu-trigger]:from-65%",
    "in-data-[sidebar-intent=fleet]:rounded-none",
  ],
  variants: {
    collapsed: {
      true: "size-9 justify-center gap-x-0 p-0",
    },
    isCurrent: {
      true: "bg-primary text-primary-fg data-hovered:bg-primary data-hovered:text-primary-fg **:data-[slot=menu-trigger]:from-primary **:data-[slot=icon]:text-primary-fg [&_.text-muted-fg]:text-primary-fg/80",
    },
    isActive: {
      true: "bg-(--sidebar-accent) text-sidebar-fg **:data-[slot=menu-trigger]:flex",
    },
    isDisabled: {
      true: "cursor-default opacity-50",
    },
  },
})

interface SidebarItemProps extends Omit<React.ComponentProps<typeof Link>, "children"> {
  isCurrent?: boolean
  tooltip?: React.ReactNode | string
  children?:
  | React.ReactNode
  | ((
    values: LinkRenderProps & { defaultChildren: React.ReactNode; isCollapsed: boolean },
  ) => React.ReactNode)
  badge?: string | number | undefined
}

const SidebarItem = ({
  isCurrent,
  tooltip,
  children,
  badge,
  className,
  ref,
  ...props
}: SidebarItemProps) => {
  const { state, isMobile } = useSidebar()
  const isCollapsed = state === "collapsed" && !isMobile
  const link = (
    <Link
      ref={ref}
      data-sidebar-item="true"
      aria-current={isCurrent ? "page" : undefined}
      className={composeRenderProps(className, (cls, renderProps) =>
        sidebarItem({
          ...renderProps,
          isCurrent,
          collapsed: isCollapsed,
          isActive: renderProps.isPressed || renderProps.isFocusVisible || renderProps.isHovered,
          className: cls,
        }),
      )}
      {...props}
    >
      {(values) => (
        <>
          {typeof children === "function" ? children({ ...values, isCollapsed }) : children}

          {badge &&
            (state !== "collapsed" ? (
              <Badge
                shape="square"
                intent="primary"
                data-slot="sidebar-badge"
                className={cn(
                  "-translate-y-1/2 absolute inset-ring-1 inset-ring-primary/20 inset-y-1/2 right-1.5 h-5.5 w-auto text-[10px] transition-colors group-data-current:inset-ring-transparent",
                  isCurrent && [
                    "bg-[color-mix(in_oklab,var(--color-primary)_20%,white_20%)] text-primary-fg dark:bg-[color-mix(in_oklab,var(--color-primary)_20%,white_15%)] dark:text-current ",
                    "group-data-hovered:bg-[color-mix(in_oklab,var(--color-primary)_25%,white_30%)]",
                    "dark:group-data-hovered:bg-[color-mix(in_oklab,var(--color-primary)_25%,white_20%)]",
                  ],
                )}
              >
                {badge}
              </Badge>
            ) : (
              <div
                aria-hidden
                className="absolute top-1 right-1 size-1.5 rounded-full bg-primary"
              />
            ))}
        </>
      )}
    </Link>
  )

  return isCollapsed && tooltip ? (
    <Tooltip delay={0}>
      {link}
      <Tooltip.Content
        className="**:data-[slot=icon]:hidden **:data-[slot=sidebar-label-mask]:hidden"
        intent="inverse"
        showArrow={false}
        placement="right"
      >
        {tooltip}
      </Tooltip.Content>
    </Tooltip>
  ) : (
    link
  )
}

const sidebarLink = tv({
  base: "flex w-full items-center gap-x-2 focus:outline-hidden",
  variants: {
    collapsed: {
      true: "absolute inset-0 size-full justify-center",
    },
  },
})

interface SidebarLinkProps extends LinkProps {
  ref?: React.Ref<HTMLAnchorElement>
}
const SidebarLink = ({ className, ref, ...props }: SidebarLinkProps) => {
  const { state, isMobile } = useSidebar()
  const collapsed = state === "collapsed" && !isMobile
  return (
    <Link
      ref={ref}
      className={composeRenderProps(className, (className, renderProps) =>
        sidebarLink({
          ...renderProps,
          collapsed,
          className,
        }),
      )}
      {...props}
    />
  )
}

const SidebarInset = ({ className, ref, ...props }: React.ComponentProps<"main">) => {
  return (
    <main
      ref={ref}
      className={cn(
        "relative flex min-h-svh w-full flex-1 flex-col peer-data-[sidebar-intent=inset]:border peer-data-[sidebar-intent=inset]:border-(--sidebar-border)",
        "bg-bg peer-data-[sidebar-intent=inset]:overflow-hidden dark:peer-data-[sidebar-intent=inset]:bg-sidebar",
        "peer-data-[sidebar-intent=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[sidebar-state=collapsed]:peer-data-[sidebar-intent=inset]:ml-2 md:peer-data-[sidebar-intent=inset]:m-2 md:peer-data-[sidebar-intent=inset]:ml-0 md:peer-data-[sidebar-intent=inset]:rounded-xl md:peer-data-[sidebar-intent=inset]:shadow-xs",
        className,
      )}
      {...props}
    />
  )
}

type SidebarDisclosureGroupProps = DisclosureGroupProps
const SidebarDisclosureGroup = ({
  allowsMultipleExpanded = true,
  className,
  ...props
}: SidebarDisclosureGroupProps) => {
  return (
    <DisclosureGroup
      data-sidebar-disclosure-group="true"
      allowsMultipleExpanded={allowsMultipleExpanded}
      className={composeTailwindRenderProps(className, "flex flex-col gap-y-6")}
      {...props}
    />
  )
}

interface SidebarDisclosureProps extends DisclosureProps {
  ref?: React.Ref<HTMLDivElement>
}
const SidebarDisclosure = ({ className, ref, ...props }: SidebarDisclosureProps) => {
  return (
    <Disclosure
      ref={ref}
      data-sidebar-disclosure="true"
      className={composeTailwindRenderProps(className, "in-data-[sidebar-intent=fleet]:px-0 px-2")}
      {...props}
    />
  )
}

const sidebarDisclosureTrigger = tv({
  base: [
    "group relative flex w-full cursor-pointer items-center gap-x-2 overflow-hidden rounded-lg px-2.5 py-2 text-sidebar-fg/70 outline-hidden sm:text-sm",
    "in-data-[sidebar-intent=fleet]:rounded-none in-data-[sidebar-intent=fleet]:py-2 in-data-[sidebar-intent=fleet]:**:data-[slot=chevron]:hidden",
  ],
  variants: {
    collapsed: {
      true: "size-9 justify-center gap-x-0 p-0",
    },
    isActive: {
      true: "bg-(--sidebar-accent) text-sidebar-fg",
    },
    isDisabled: {
      true: "cursor-default opacity-50",
    },
  },
})

interface SidebarDisclosureTriggerProps extends ButtonProps {
  ref?: React.Ref<HTMLButtonElement>
}
const SidebarDisclosureTrigger = ({ className, ref, ...props }: SidebarDisclosureTriggerProps) => {
  const { state, isMobile } = useSidebar()
  const collapsed = state === "collapsed" && !isMobile
  return (
    <Heading level={3}>
      <Trigger
        ref={ref}
        slot="trigger"
        className={composeRenderProps(className, (className, renderProps) =>
          sidebarDisclosureTrigger({
            ...renderProps,
            collapsed,
            isActive: renderProps.isPressed || renderProps.isFocusVisible || renderProps.isHovered,
            className,
          }),
        )}
        {...props}
      >
        {(values) => (
          <>
            {typeof props.children === "function" ? props.children(values) : props.children}
            {state !== "collapsed" && (
              <IconChevronLgLeft
                data-slot="chevron"
                className="group-aria-expanded:-rotate-90 z-10 ml-auto size-3.5 transition-transform"
              />
            )}
          </>
        )}
      </Trigger>
    </Heading>
  )
}

const SidebarDisclosurePanel = (props: React.ComponentProps<typeof DisclosurePanel>) => {
  return <DisclosurePanel data-sidebar-disclosure-panel="true" {...props} />
}

type SidebarSeparatorProps = SeparatorProps
const SidebarSeparator = ({ className, ref, ...props }: SidebarSeparatorProps) => {
  return (
    <Separator
      ref={ref}
      className={cn("mx-auto my-2 w-[calc(var(--sidebar-width)-theme(spacing.6))]", className)}
      {...props}
    />
  )
}

const SidebarTrigger = ({ onPress, ...props }: React.ComponentProps<typeof Trigger>) => {
  const { toggleSidebar } = useSidebar()
  return (
    <Tooltip delay={50}>
      <Button
        aria-label={props["aria-label"] || "Toggle Sidebar"}
        data-sidebar-trigger="true"
        appearance="plain"
        size="square-petite"
        onPress={(event) => {
          onPress?.(event)
          toggleSidebar()
        }}
        {...props}
      >
        <IconSidebarFill className="hidden md:inline !size-6" />
        <IconHamburger className="inline md:hidden !size-6" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
      <Tooltip.Content>
        <p>Toggle Sidebar</p>
      </Tooltip.Content>
    </Tooltip>
  )
}

type SidebarRailProps = React.ComponentProps<"button">
const SidebarRail = ({ className, ref, ...props }: SidebarRailProps) => {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      title="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      className={cn(
        "-translate-x-1/2 group-data-[sidebar-side=left]/sidebar-container:-right-4 absolute inset-y-0 z-20 hidden w-4 outline-hidden transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] data-hovered:after:bg-transparent group-data-[sidebar-side=right]/sidebar-container:left-0 sm:flex",
        "in-data-[sidebar-side=left]:cursor-w-resize in-data-[sidebar-side=right]:cursor-e-resize",
        "[[data-sidebar-side=left][data-sidebar-state=collapsed]_&]:cursor-e-resize [[data-sidebar-side=right][data-sidebar-state=collapsed]_&]:cursor-w-resize",
        "group-data-[sidebar-collapsible=hidden]/sidebar-container:translate-x-0 group-data-[sidebar-collapsible=hidden]/sidebar-container:hover:bg-secondary group-data-[sidebar-collapsible=hidden]/sidebar-container:after:left-full",
        "[[data-sidebar-side=left][data-sidebar-collapsible=hidden]_&]:-right-2 [[data-sidebar-side=right][data-sidebar-collapsible=hidden]_&]:-left-2",
        className,
      )}
      {...props}
    />
  )
}

type SidebarLabelProps = React.ComponentProps<typeof Text>
const SidebarLabel = ({ className, ref, ...props }: SidebarLabelProps) => {
  const { state, isMobile } = useSidebar()
  const collapsed = state === "collapsed" && !isMobile
  if (!collapsed) {
    return (
      <Text
        ref={ref}
        slot="label"
        className={cn("flex w-full flex-1 overflow-hidden whitespace-nowrap", className)}
        {...props}
      >
        {props.children}
      </Text>
    )
  }
  return null
}

const nav = tv({
  base: [
    "isolate flex h-[3.2rem] items-center justify-between gap-x-2 px-4 text-navbar-fg sm:justify-start md:w-full",
    "group-has-data-[sidebar-intent=default]/sidebar-root:border-b group-has-data-[sidebar-intent=fleet]/sidebar-root:border-b group-has-data-[sidebar-intent=default]/sidebar-root:bg-sidebar",
  ],
  variants: {
    isSticky: {
      true: "static top-0 z-40 group-has-data-[sidebar-intent=default]/sidebar-root:sticky",
    },
  },
})

interface SidebarNavProps extends React.ComponentProps<"nav"> {
  isSticky?: boolean
}

const SidebarNav = ({ isSticky = false, className, ...props }: SidebarNavProps) => {
  return <nav data-slot="sidebar-nav" {...props} className={nav({ isSticky, className })} />
}

export type {
  SidebarProviderProps,
  SidebarProps,
  SidebarItemProps,
  SidebarNavProps,
  SidebarDisclosureGroupProps,
  SidebarDisclosureProps,
  SidebarSeparatorProps,
  SidebarLabelProps,
  SidebarRailProps,
  SidebarLinkProps,
  SidebarDisclosureTriggerProps,
}

export {
  SidebarProvider,
  SidebarNav,
  SidebarHeader,
  SidebarContent,
  SidebarSectionGroup,
  SidebarSection,
  SidebarItem,
  SidebarLink,
  SidebarFooter,
  Sidebar,
  SidebarDisclosureGroup,
  SidebarDisclosure,
  SidebarSeparator,
  SidebarDisclosureTrigger,
  SidebarDisclosurePanel,
  SidebarTrigger,
  SidebarLabel,
  SidebarInset,
  SidebarRail,
  useSidebar,
}
