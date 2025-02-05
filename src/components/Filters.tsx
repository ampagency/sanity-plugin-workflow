import {ResetIcon, UserIcon} from '@sanity/icons'
import {Button, Card, Flex, Menu, MenuButton} from '@sanity/ui'
import {useCallback} from 'react'
import {useCurrentUser, UserAvatar, useSchema} from 'sanity'
import {UserExtended, UserSelectMenu} from 'sanity-plugin-utils'

type FiltersProps = {
  uniqueAssignedUsers: UserExtended[]
  selectedUserIds: string[]
  schemaTypes: string[]
  selectedSchemaTypes: string[]
  toggleSelectedUser: (userId: string) => void
  resetSelectedUsers: () => void
  toggleSelectedSchemaType: (schemaType: string) => void
}

export default function Filters(props: FiltersProps) {
  const {
    uniqueAssignedUsers = [],
    selectedUserIds,
    schemaTypes,
    selectedSchemaTypes,
    toggleSelectedUser,
    resetSelectedUsers,
    toggleSelectedSchemaType,
  } = props

  const currentUser = useCurrentUser()
  const schema = useSchema()

  const onAdd = useCallback(
    (id: string) => {
      if (!selectedUserIds.includes(id)) {
        toggleSelectedUser(id)
      }
    },
    [selectedUserIds, toggleSelectedUser]
  )

  const onRemove = useCallback(
    (id: string) => {
      if (selectedUserIds.includes(id)) {
        toggleSelectedUser(id)
      }
    },
    [selectedUserIds, toggleSelectedUser]
  )

  const onClear = useCallback(() => {
    resetSelectedUsers()
  }, [resetSelectedUsers])

  if (uniqueAssignedUsers.length === 0 && schemaTypes.length < 2) {
    return null
  }

  const meInUniqueAssignees =
    currentUser?.id && uniqueAssignedUsers.find((u) => u.id === currentUser.id)
  const uniqueAssigneesNotMe = uniqueAssignedUsers.filter(
    (u) => u.id !== currentUser?.id
  )

  return (
    <Card tone="primary" padding={2} borderBottom style={{overflowX: 'hidden'}}>
      <Flex align="center">
        <Flex align="center" gap={1} flex={1}>
          {uniqueAssignedUsers.length > 5 ? (
            <Card tone="default">
              <MenuButton
                button={
                  <Button
                    text="Filter Assignees"
                    tone="primary"
                    icon={UserIcon}
                  />
                }
                id="user-filters"
                menu={
                  <Menu>
                    <UserSelectMenu
                      value={selectedUserIds}
                      userList={uniqueAssignedUsers}
                      onAdd={onAdd}
                      onRemove={onRemove}
                      onClear={onClear}
                      labels={{
                        addMe: 'Filter mine',
                        removeMe: 'Clear mine',
                        clear: 'Clear filters',
                      }}
                    />
                  </Menu>
                }
                popover={{portal: true}}
              />
            </Card>
          ) : (
            <>
              {meInUniqueAssignees ? (
                <>
                  <Button
                    padding={0}
                    mode={
                      selectedUserIds.includes(currentUser.id)
                        ? `default`
                        : `bleed`
                    }
                    onClick={() => toggleSelectedUser(currentUser.id)}
                  >
                    <Flex padding={1} align="center" justify="center">
                      <UserAvatar user={currentUser.id} size={1} withTooltip />
                    </Flex>
                  </Button>
                  <Card borderRight style={{height: 30}} tone="inherit" />
                </>
              ) : null}
              {uniqueAssigneesNotMe.map((user) => (
                <Button
                  key={user.id}
                  padding={0}
                  mode={selectedUserIds.includes(user.id) ? `default` : `bleed`}
                  onClick={() => toggleSelectedUser(user.id)}
                >
                  <Flex padding={1} align="center" justify="center">
                    <UserAvatar user={user} size={1} withTooltip />
                  </Flex>
                </Button>
              ))}

              {selectedUserIds.length > 0 ? (
                <Button
                  text="Clear"
                  onClick={resetSelectedUsers}
                  mode="ghost"
                  icon={ResetIcon}
                />
              ) : null}
            </>
          )}
        </Flex>

        {schemaTypes.length > 1 ? (
          <Flex align="center" gap={1}>
            {schemaTypes.map((typeName) => {
              const schemaType = schema.get(typeName)

              if (!schemaType) {
                return null
              }

              return (
                <Button
                  key={typeName}
                  text={schemaType?.title ?? typeName}
                  icon={schemaType?.icon ?? undefined}
                  mode={
                    selectedSchemaTypes.includes(typeName) ? `default` : `ghost`
                  }
                  onClick={() => toggleSelectedSchemaType(typeName)}
                />
              )
            })}
          </Flex>
        ) : null}
      </Flex>
    </Card>
  )
}
