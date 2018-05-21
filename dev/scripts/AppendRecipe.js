import React from 'react';

const AppendRecipe = (props) => {

    return (
        <div className="third">
            <div className="imageHolder">
                <div className="h3Holder">
                    <h3>{props.recipeName}</h3>
                </div>
                <img className="appendImage" src={props.recipeUrl} alt="recipe image" />
            </div>
            <div className="linkArrow">
                <a target="_blank" href={`https://www.yummly.com/recipe/` + props.recipeId}>See the full recipe here</a>
                <img src="../../images/next-white.png" alt="next arrow" />
            </div>
            <button className="saveRecipeButton" onClick={() => {
                props.saveRecipe(props.recipeId)
            }}>Save recipe</button>
        </div>
    )
}

export default AppendRecipe;

// props.saveRecipe(props.recipeId, props.recipeName