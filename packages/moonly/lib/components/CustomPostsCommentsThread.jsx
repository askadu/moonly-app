import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'meteor/vulcan:i18n';
import { withList, withCurrentUser, Components, registerComponent, replaceComponent, Utils } from 'meteor/vulcan:core';
import {Comments} from "meteor/example-forum";

const CustomPostsCommentsThread = (props, /* context*/) => {

  const {loading, terms: { postId }, results, totalCount, currentUser} = props;
  
  if (loading) {
  
    return <div className="posts-comments-thread"><Components.Loading/></div>
  
  } else {
    
    const resultsClone = _.map(results, _.clone); // we don't want to modify the objects we got from props
    const nestedComments = Utils.unflatten(resultsClone, {idProperty: '_id', parentIdProperty: 'parentCommentId'});

    return (
      <div className="posts-comments-thread">
        <h4 className="posts-comments-thread-title"><FormattedMessage id="comments.comments"/></h4>
        {!!currentUser ?
          <div className="posts-comments-thread-new">
            <Components.CommentsNewForm
              postId={postId} 
              type="comment" 
            />
          </div> :
          <div>
            <Components.ModalTrigger size="small" component={<a href="#"><FormattedMessage id="comments.please_log_in"/></a>}>
              <Components.AccountsLoginForm/>
            </Components.ModalTrigger>
          </div> 
        }
        <Components.CommentsList currentUser={currentUser} comments={nestedComments} commentCount={totalCount}/>
      </div>
    );
  }
};

CustomPostsCommentsThread.displayName = 'PostsCommentsThread';

CustomPostsCommentsThread.propTypes = {
  currentUser: PropTypes.object
};

const options = {
  collection: Comments,
  queryName: 'commentsListQuery',
  fragmentName: 'CommentsList',
  limit: 0,
};

replaceComponent('PostsCommentsThread', CustomPostsCommentsThread, [withList, options], withCurrentUser);
