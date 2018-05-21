import React from 'react';
import { TwitterIcon } from 'react-share';
import { TwitterShareButton } from 'react-share';

const SavedRecipe = (props) => {
    return (
    <div className="third savedThird">
        <div className="savedThirdContent">
            <div className="removeRecipeName">
                <button className="removeButton" onClick={() => {
                    props.removeRecipe(props.firebaseKey)
                    }}>
                    <img src="../../images/spoons(1).png" alt="spoon image" />
                    <p className="removePara">Remove?</p>
                </button>
            </div>
            <div className="imageHolder">
                <div className="h3Holder">
                    <h3>{props.recipeName}</h3>
                </div>
                <img src={props.recipeUrl} alt="recipe image" />
            </div>
            <div className="linkArrow">
                <a target="_blank" href={`https://www.yummly.com/recipe/` + props.recipeId}>See the full recipe here</a>
                <img src="../../images/next-white.png" alt="next arrow" />
            </div>
            
            <h4>Your Shopping List:</h4>
                <ul>
                {(props.ingredients).map((ingredient) => {
                        return <li>
                            <label className="visibilityHidden" for="checkbox"></label>
                            <input className="listInput" type='checkbox'/>{ingredient}
                            </li>
                })}
            </ul>
            <div className="shareMeal">
                <TwitterIcon size={30} round={true}/>
                <p>Share your meal!</p>
                <TwitterShareButton 
                        size={50} height={100} url={`https://www.yummly.com/recipe/` + props.recipeId}
                />
            </div>
            </div>
        </div>
    )      
}

export default SavedRecipe;