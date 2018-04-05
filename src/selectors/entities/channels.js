'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getSortedDirectChannelIds = exports.getSortedDirectChannelWithLastPostAt = exports.getSortedDirectChannelWithUnreads = exports.getSortedPrivateChannelIds = exports.getSortedPrivateChannelWithUnreadsIds = exports.getSortedPublicChannelIds = exports.getSortedPublicChannelWithUnreadsIds = exports.getSortedFavoriteChannelIds = exports.getSortedFavoriteChannelWithUnreadsIds = exports.getSortedUnreadChannelIds = exports.getUnreadChannelIds = exports.getChannelIdsForCurrentTeam = exports.getChannelIdsInCurrentTeam = exports.getDirectChannelIds = exports.canManageChannelMembers = exports.getUnreadsInCurrentTeam = exports.getUnreads = exports.getMembersInCurrentChannel = exports.getDefaultChannel = exports.getChannelsWithUnreadSection = exports.getChannelsByCategory = exports.getOtherChannels = exports.getMyChannels = exports.getGroupChannels = exports.getDirectChannels = exports.getChannelsNameMapInCurrentTeam = exports.getChannelsInCurrentTeam = exports.getChannelSetInCurrentTeam = exports.getCurrentChannelStats = exports.getMyCurrentChannelMembership = exports.getMyChannelMember = exports.getCurrentChannel = exports.getChannel = exports.getDirectChannelsSet = exports.getCurrentChannelId = undefined;

var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }return target;
};

exports.getAllChannels = getAllChannels;
exports.getAllChannelStats = getAllChannelStats;
exports.getChannelsInTeam = getChannelsInTeam;
exports.getMyChannelMemberships = getMyChannelMemberships;
exports.getChannelMembersInChannels = getChannelMembersInChannels;
exports.makeGetChannel = makeGetChannel;
exports.getGroupOrDirectChannelVisibility = getGroupOrDirectChannelVisibility;

var _reselect = require('reselect');

var _constants = require('../../constants');

var _common = require('./common');

var _general = require('./general');

var _preferences = require('./preferences');

var _posts = require('./posts');

var _teams = require('./teams');

var _channel_utils = require('../../utils/channel_utils');

var _helpers = require('../../utils/helpers');

function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i];
        }return arr2;
    } else {
        return Array.from(arr);
    }
} // Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

exports.getCurrentChannelId = _common.getCurrentChannelId;
function getAllChannels(state) {
    return state.entities.channels.channels;
}

function getAllChannelStats(state) {
    return state.entities.channels.stats;
}

function getChannelsInTeam(state) {
    return state.entities.channels.channelsInTeam;
}

var getDirectChannelsSet = exports.getDirectChannelsSet = (0, _reselect.createSelector)(getChannelsInTeam, function (channelsInTeam) {
    return channelsInTeam[''] || new Set();
});

function getMyChannelMemberships(state) {
    return state.entities.channels.myMembers;
}

function getChannelMembersInChannels(state) {
    return state.entities.channels.membersInChannel;
}

function makeGetChannel() {
    return (0, _reselect.createSelector)(getAllChannels, function (state, props) {
        return props.id;
    }, function (state) {
        return state.entities.users;
    }, _preferences.getTeammateNameDisplaySetting, function (allChannels, channelId, users, teammateNameDisplay) {
        var channel = allChannels[channelId];
        if (channel) {
            return (0, _channel_utils.completeDirectChannelInfo)(users, teammateNameDisplay, channel);
        }
        return channel;
    });
}

var getChannel = exports.getChannel = (0, _reselect.createSelector)(getAllChannels, function (state, id) {
    return id;
}, function (state) {
    return state.entities.users;
}, _preferences.getTeammateNameDisplaySetting, function (allChannels, channelId, users, teammateNameDisplay) {
    var channel = allChannels[channelId];
    if (channel) {
        return (0, _channel_utils.completeDirectChannelInfo)(users, teammateNameDisplay, channel);
    }
    return channel;
});

var getCurrentChannel = exports.getCurrentChannel = (0, _reselect.createSelector)(getAllChannels, _common.getCurrentChannelId, function (state) {
    return state.entities.users;
}, _preferences.getTeammateNameDisplaySetting, function (allChannels, currentChannelId, users, teammateNameDisplay) {
    var channel = allChannels[currentChannelId];
    if (channel) {
        return (0, _channel_utils.completeDirectChannelInfo)(users, teammateNameDisplay, channel);
    }
    return channel;
});

var getMyChannelMember = exports.getMyChannelMember = (0, _reselect.createSelector)(getMyChannelMemberships, function (state, channelId) {
    return channelId;
}, function (channelMemberships, channelId) {
    return channelMemberships[channelId] || {};
});

var getMyCurrentChannelMembership = exports.getMyCurrentChannelMembership = (0, _reselect.createSelector)(_common.getCurrentChannelId, getMyChannelMemberships, function (currentChannelId, channelMemberships) {
    return channelMemberships[currentChannelId] || {};
});

var getCurrentChannelStats = exports.getCurrentChannelStats = (0, _reselect.createSelector)(getAllChannelStats, _common.getCurrentChannelId, function (allChannelStats, currentChannelId) {
    return allChannelStats[currentChannelId];
});

var getChannelSetInCurrentTeam = exports.getChannelSetInCurrentTeam = (0, _reselect.createSelector)(_teams.getCurrentTeamId, getChannelsInTeam, function (currentTeamId, channelsInTeam) {
    return channelsInTeam[currentTeamId] || [];
});

function sortAndInjectChannels(channels, channelSet, locale) {
    var currentChannels = [];
    if (typeof channelSet === 'undefined') {
        return currentChannels;
    }

    channelSet.forEach(function (c) {
        currentChannels.push(channels[c]);
    });

    return currentChannels.sort(_channel_utils.sortChannelsByDisplayName.bind(null, locale));
}

var getChannelsInCurrentTeam = exports.getChannelsInCurrentTeam = (0, _reselect.createSelector)(getAllChannels, getChannelSetInCurrentTeam, _common.getCurrentUser, function (channels, currentTeamChannelSet, currentUser) {
    var locale = 'en';
    if (currentUser && currentUser.locale) {
        locale = currentUser.locale;
    }
    return sortAndInjectChannels(channels, currentTeamChannelSet, locale);
});

var getChannelsNameMapInCurrentTeam = exports.getChannelsNameMapInCurrentTeam = (0, _reselect.createSelector)(getAllChannels, getChannelSetInCurrentTeam, function (channels, currentTeamChannelSet) {
    var channelMap = {};
    currentTeamChannelSet.forEach(function (id) {
        var channel = channels[id];
        channelMap[channel.name] = channel;
    });
    return channelMap;
});

// Returns both DMs and GMs
var getDirectChannels = exports.getDirectChannels = (0, _reselect.createSelector)(getAllChannels, getDirectChannelsSet, function (state) {
    return state.entities.users;
}, _preferences.getTeammateNameDisplaySetting, function (channels, channelSet, users, teammateNameDisplay) {
    var dmChannels = [];
    channelSet.forEach(function (c) {
        dmChannels.push((0, _channel_utils.completeDirectChannelInfo)(users, teammateNameDisplay, channels[c]));
    });
    return dmChannels;
});

// Returns only GMs
var getGroupChannels = exports.getGroupChannels = (0, _reselect.createSelector)(getAllChannels, getDirectChannelsSet, function (state) {
    return state.entities.users;
}, _preferences.getTeammateNameDisplaySetting, function (channels, channelSet, users, teammateNameDisplay) {
    var gmChannels = [];
    channelSet.forEach(function (id) {
        var channel = channels[id];
        if (channel.type === _constants.General.GM_CHANNEL) {
            gmChannels.push((0, _channel_utils.completeDirectChannelInfo)(users, teammateNameDisplay, channel));
        }
    });
    return gmChannels;
});

var getMyChannels = exports.getMyChannels = (0, _reselect.createSelector)(getChannelsInCurrentTeam, getDirectChannels, getMyChannelMemberships, function (channels, directChannels, myMembers) {
    return [].concat(_toConsumableArray(channels), _toConsumableArray(directChannels)).filter(function (c) {
        return myMembers.hasOwnProperty(c.id);
    });
});

var getOtherChannels = exports.getOtherChannels = (0, _reselect.createSelector)(getChannelsInCurrentTeam, getMyChannelMemberships, function (channels, myMembers) {
    return channels.filter(function (c) {
        return !myMembers.hasOwnProperty(c.id) && c.type === _constants.General.OPEN_CHANNEL;
    });
});

var getChannelsByCategory = exports.getChannelsByCategory = (0, _reselect.createSelector)(_common.getCurrentChannelId, getMyChannels, getMyChannelMemberships, _general.getConfig, _preferences.getMyPreferences, _preferences.getTeammateNameDisplaySetting, function (state) {
    return state.entities.users;
}, _posts.getLastPostPerChannel, function (currentChannelId, channels, myMembers, config, myPreferences, teammateNameDisplay, usersState, lastPosts) {
    var allChannels = channels.map(function (c) {
        var channel = _extends({}, c);
        channel.isCurrent = c.id === currentChannelId;
        return channel;
    });
    // console.log("mano aqui é pra vir organizado.......\n", (0, _channel_utils.buildDisplayableChannelList)(usersState, allChannels, myMembers, config, myPreferences, teammateNameDisplay, lastPosts));
    return (0, _channel_utils.buildDisplayableChannelList)(usersState, allChannels, myMembers, config, myPreferences, teammateNameDisplay, lastPosts);
});

var getChannelsWithUnreadSection = exports.getChannelsWithUnreadSection = (0, _reselect.createSelector)(_common.getCurrentChannelId, getMyChannels, getMyChannelMemberships, _general.getConfig, _preferences.getMyPreferences, _preferences.getTeammateNameDisplaySetting, function (state) {
    return state.entities.users;
}, _posts.getLastPostPerChannel, function (currentChannelId, channels, myMembers, config, myPreferences, teammateNameDisplay, usersState, lastPosts) {
    var allChannels = channels.map(function (c) {
        var channel = _extends({}, c);
        channel.isCurrent = c.id === currentChannelId;
        return channel;
    });

    return (0, _channel_utils.buildDisplayableChannelListWithUnreadSection)(usersState, allChannels, myMembers, config, myPreferences, teammateNameDisplay, lastPosts);
});

var getDefaultChannel = exports.getDefaultChannel = (0, _reselect.createSelector)(getAllChannels, _teams.getCurrentTeamId, function (channels, teamId) {
    return Object.values(channels).find(function (c) {
        return c.team_id === teamId && c.name === _constants.General.DEFAULT_CHANNEL;
    });
});

var getMembersInCurrentChannel = exports.getMembersInCurrentChannel = (0, _reselect.createSelector)(_common.getCurrentChannelId, getChannelMembersInChannels, function (currentChannelId, members) {
    return members[currentChannelId];
});

var getUnreads = exports.getUnreads = (0, _reselect.createSelector)(_common.getCurrentChannelId, getAllChannels, getMyChannelMemberships, function (currentChannelId, channels, myMembers) {
    var messageCount = 0;
    var mentionCount = 0;
    Object.keys(myMembers).forEach(function (channelId) {
        var channel = channels[channelId];
        var m = myMembers[channelId];
        if (channel && m && channel.id !== currentChannelId) {
            if (channel.type === 'D') {
                mentionCount += channel.total_msg_count - m.msg_count;
            } else if (m.mention_count > 0) {
                mentionCount += m.mention_count;
            }
            if (m.notify_props && m.notify_props.mark_unread !== 'mention' && channel.total_msg_count - m.msg_count > 0) {
                messageCount += 1;
            }
        }
    });

    return { messageCount: messageCount, mentionCount: mentionCount };
});

var getUnreadsInCurrentTeam = exports.getUnreadsInCurrentTeam = (0, _reselect.createSelector)(_common.getCurrentChannelId, getMyChannels, getMyChannelMemberships, function (currentChannelId, channels, myMembers) {
    var messageCount = 0;
    var mentionCount = 0;

    channels.forEach(function (channel) {
        var m = myMembers[channel.id];
        if (m && channel.id !== currentChannelId) {
            if (channel.type === 'D') {
                mentionCount += channel.total_msg_count - m.msg_count;
            } else if (m.mention_count > 0) {
                mentionCount += m.mention_count;
            }
            if (m.notify_props && m.notify_props.mark_unread !== 'mention' && channel.total_msg_count - m.msg_count > 0) {
                messageCount += 1;
            }
        }
    });

    return { messageCount: messageCount, mentionCount: mentionCount };
});

var canManageChannelMembers = exports.canManageChannelMembers = (0, _reselect.createSelector)(getCurrentChannel, _common.getCurrentUser, _teams.getCurrentTeamMembership, getMyCurrentChannelMembership, _general.getConfig, _general.getLicense, _channel_utils.canManageMembers);

var getDirectChannelIds = exports.getDirectChannelIds = (0, _helpers.createIdsSelector)(getDirectChannelsSet, function (directIds) {
    return Array.from(directIds);
});

var getChannelIdsInCurrentTeam = exports.getChannelIdsInCurrentTeam = (0, _helpers.createIdsSelector)(_teams.getCurrentTeamId, getChannelsInTeam, function (currentTeamId, channelsInTeam) {
    return Array.from(channelsInTeam[currentTeamId] || []);
});

var getChannelIdsForCurrentTeam = exports.getChannelIdsForCurrentTeam = (0, _helpers.createIdsSelector)(getChannelIdsInCurrentTeam, getDirectChannelIds, function (channels, direct) {
    return [].concat(_toConsumableArray(channels), _toConsumableArray(direct));
});

var getUnreadChannelIds = exports.getUnreadChannelIds = (0, _helpers.createIdsSelector)(getAllChannels, getMyChannelMemberships, getChannelIdsForCurrentTeam, function (channels, members, teamChannelIds) {
    return teamChannelIds.filter(function (id) {
        var c = channels[id];
        var m = members[id];

        if (c && m) {
            var chHasUnread = c.total_msg_count - m.msg_count > 0;
            var chHasMention = m.mention_count > 0;
            if (m.notify_props && m.notify_props.mark_unread !== 'mention' && chHasUnread || chHasMention) {
                return true;
            }
        }
        return false;
    });
});

function filterUnreadChannels(unreadIds, channelIds) {
    return channelIds.filter(function (id) {
        return !unreadIds.includes(id);
    });
}

var getSortedUnreadChannelIds = exports.getSortedUnreadChannelIds = (0, _helpers.createIdsSelector)(_common.getCurrentUser, _common.getUsers, getAllChannels, getMyChannelMemberships, getUnreadChannelIds, _preferences.getTeammateNameDisplaySetting, function (currentUser, profiles, channels, members, unreadIds, settings) {
    // If we receive an unread for a channel and then a mention the channel
    // won't be sorted correctly until we receive a message in another channel
    if (!currentUser) {
        return [];
    }

    var locale = currentUser.locale || 'en';
    var allUnreadChannels = unreadIds.map(function (id) {
        var c = channels[id];
        if (c.type === _constants.General.DM_CHANNEL || c.type === _constants.General.GM_CHANNEL) {
            return (0, _channel_utils.completeDirectChannelDisplayName)(currentUser.id, profiles, settings, c);
        }

        return c;
    }).sort(function (a, b) {
        var aMember = members[a.id];
        var bMember = members[b.id];

        var aIsMention = a.type === _constants.General.DM_CHANNEL || aMember && aMember.mention_count > 0;
        var bIsMention = b.type === _constants.General.DM_CHANNEL || bMember && bMember.mention_count > 0;

        if (aIsMention === bIsMention) {
            return (0, _channel_utils.sortChannelsByDisplayName)(locale, a, b);
        } else if (aIsMention) {
            return -1;
        }

        return 1;
    });

    return allUnreadChannels.map(function (c) {
        return c.id;
    });
});

var getSortedFavoriteChannelWithUnreadsIds = exports.getSortedFavoriteChannelWithUnreadsIds = (0, _helpers.createIdsSelector)(_common.getCurrentUser, _common.getUsers, getAllChannels, getMyChannelMemberships, _preferences.getFavoritesPreferences, getChannelIdsForCurrentTeam, _preferences.getTeammateNameDisplaySetting, _general.getConfig, _preferences.getMyPreferences, function (currentUser, profiles, channels, myMembers, favoriteIds, teamChannelIds, settings, config, prefs) {
    if (!currentUser) {
        return [];
    }

    var locale = currentUser.locale || 'en';
    var favoriteChannel = favoriteIds.filter(function (id) {
        if (!myMembers[id]) {
            return false;
        }

        var channel = channels[id];
        var otherUserId = (0, _channel_utils.getUserIdFromChannelName)(currentUser.id, channel.name);
        if (channel.type === _constants.General.DM_CHANNEL && !(0, _channel_utils.isDirectChannelVisible)(profiles[otherUserId] || otherUserId, config, prefs, channel)) {
            return false;
        } else if (channel.type === _constants.General.GM_CHANNEL && !(0, _channel_utils.isGroupChannelVisible)(config, prefs, channel)) {
            return false;
        }

        return teamChannelIds.includes(id);
    }).map(function (id) {
        var c = channels[id];
        if (c.type === _constants.General.DM_CHANNEL || c.type === _constants.General.GM_CHANNEL) {
            return (0, _channel_utils.completeDirectChannelDisplayName)(currentUser.id, profiles, settings, c);
        }

        return c;
    }).sort(_channel_utils.sortChannelsByDisplayName.bind(null, locale));
    return favoriteChannel.map(function (f) {
        return f.id;
    });
});

var getSortedFavoriteChannelIds = exports.getSortedFavoriteChannelIds = (0, _helpers.createIdsSelector)(getUnreadChannelIds, getSortedFavoriteChannelWithUnreadsIds, filterUnreadChannels);

var getSortedPublicChannelWithUnreadsIds = exports.getSortedPublicChannelWithUnreadsIds = (0, _helpers.createIdsSelector)(_common.getCurrentUser, getAllChannels, getMyChannelMemberships, getChannelIdsForCurrentTeam, getSortedFavoriteChannelIds, function (currentUser, channels, myMembers, teamChannelIds, favoriteIds) {
    if (!currentUser) {
        return [];
    }

    var locale = currentUser.locale || 'en';
    var publicChannels = teamChannelIds.filter(function (id) {
        if (!myMembers[id]) {
            return false;
        }
        var channel = channels[id];
        return !favoriteIds.includes(id) && teamChannelIds.includes(id) && channel.type === _constants.General.OPEN_CHANNEL;
    }).map(function (id) {
        return channels[id];
    }).sort(_channel_utils.sortChannelsByDisplayName.bind(null, locale));
    return publicChannels.map(function (c) {
        return c.id;
    });
});

var getSortedPublicChannelIds = exports.getSortedPublicChannelIds = (0, _helpers.createIdsSelector)(getUnreadChannelIds, getSortedPublicChannelWithUnreadsIds, filterUnreadChannels);

var getSortedPrivateChannelWithUnreadsIds = exports.getSortedPrivateChannelWithUnreadsIds = (0, _helpers.createIdsSelector)(_common.getCurrentUser, getAllChannels, getMyChannelMemberships, getChannelIdsForCurrentTeam, getSortedFavoriteChannelIds, function (currentUser, channels, myMembers, teamChannelIds, favoriteIds) {
    if (!currentUser) {
        return [];
    }

    var locale = currentUser.locale || 'en';
    var publicChannels = teamChannelIds.filter(function (id) {
        if (!myMembers[id]) {
            return false;
        }
        var channel = channels[id];
        return !favoriteIds.includes(id) && teamChannelIds.includes(id) && channel.type === _constants.General.PRIVATE_CHANNEL;
    }).map(function (id) {
        return channels[id];
    }).sort(_channel_utils.sortChannelsByDisplayName.bind(null, locale));
    return publicChannels.map(function (c) {
        return c.id;
    });
});

var getSortedPrivateChannelIds = exports.getSortedPrivateChannelIds = (0, _helpers.createIdsSelector)(getUnreadChannelIds, getSortedPrivateChannelWithUnreadsIds, filterUnreadChannels);

var getSortedDirectChannelWithUnreadsIds = exports.getSortedDirectChannelWithUnreadsIds = (0, _helpers.createIdsSelector)(_common.getCurrentUser, _common.getUsers, getAllChannels, _preferences.getVisibleTeammate, _preferences.getVisibleGroupIds, getSortedFavoriteChannelIds, _preferences.getTeammateNameDisplaySetting, _general.getConfig, _preferences.getMyPreferences, _posts.getLastPostPerChannel, function (currentUser, profiles, channels, teammates, groupIds, favoriteIds, settings, config, preferences, lastPosts, isFirst) {

    return getAllDirectChannels( currentUser, profiles, channels, teammates, groupIds, favoriteIds, settings, config, preferences, lastPosts )
                .sort(_channel_utils.sortChannelsByDisplayName.bind(null, locale))
                .map( function (c) {return c.id;})

});

var getSortedDirectChannelWithLastPostAt = exports.getSortedDirectChannelWithLastPostAt = (0, _helpers.createIdsSelector)(_common.getCurrentUser, _common.getUsers, getAllChannels, _preferences.getVisibleTeammate, _preferences.getVisibleGroupIds, getSortedFavoriteChannelIds, _preferences.getTeammateNameDisplaySetting, _general.getConfig, _preferences.getMyPreferences, _posts.getLastPostPerChannel, function (currentUser, profiles, channels, teammates, groupIds, favoriteIds, settings, config, preferences, lastPosts, isFirst) {

    return getAllDirectChannels( currentUser, profiles, channels, teammates, groupIds, favoriteIds, settings, config, preferences, lastPosts )
                        .sort((a,b) => b.last_post_at - a.last_post_at)

});

var getSortedDirectChannelIds = exports.getSortedDirectChannelIds = (0, _helpers.createIdsSelector)(getUnreadChannelIds, getSortedDirectChannelWithUnreadsIds, filterUnreadChannels);

function getAllDirectChannels( currentUser, profiles, channels, teammates, groupIds, favoriteIds, settings, config, preferences, lastPosts ) {
    if (!currentUser) {
        return [];
    }    
    var locale = currentUser.locale || 'en';
    var channelValues = Object.values(channels);
    var directChannelsIds = [];
    teammates.reduce(function (result, teammateId) {
        var name = (0, _channel_utils.getDirectChannelName)(currentUser.id, teammateId);
        var channel = channelValues.find(function (c) {
            return c.name === name;
        }); //eslint-disable-line max-nested-callbacks
        if (channel) {
            var lastPost = lastPosts[channel.id];
            var otherUser = profiles[(0, _channel_utils.getUserIdFromChannelName)(currentUser.id, channel.name)];
            if (!favoriteIds.includes(channel.id) && !(0, _channel_utils.isAutoClosed)(config, preferences, channel, lastPost ? lastPost.create_at : 0, otherUser ? otherUser.delete_at : 0)) {
                result.push(channel.id);
            }
        }
        return result;
    }, directChannelsIds);
    
    return groupIds.filter(function (id) {
        var channel = channels[id];
        if (channel) {
            var lastPost = lastPosts[channel.id];
            return !favoriteIds.includes(id) && !(0, _channel_utils.isAutoClosed)(config, preferences, channels[id], lastPost ? lastPost.create_at : 0);
        }

        return false;
    }).concat(directChannelsIds).map(function (id) {
        var channel = channels[id];    
        return (0, _channel_utils.completeDirectChannelDisplayName)(currentUser.id, profiles, settings, channel);
    })

}

function getGroupOrDirectChannelVisibility(state, channelId) {
    return (0, _channel_utils.isGroupOrDirectChannelVisible)(getChannel(state, channelId), getMyChannelMemberships(state), (0, _general.getConfig)(state), (0, _preferences.getMyPreferences)(state), (0, _common.getCurrentUser)(state).id, (0, _common.getUsers)(state), (0, _posts.getLastPostPerChannel)(state));
}