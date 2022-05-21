import Snippet from "../model/snippet.js";
import axios from "axios";
import { response } from "express";

export const allSnippets = async (req, res) => {
  let snippets;
  try {
    const response = await axios.get("http://localhost:5000/snippets");
    snippets = await response.data;
  } catch (error) {
    snippets = [];
  }
  res.render("index", {
    snippets: snippets,
    snippet: { title: "", description: "", language: "" },
  });
};
//find a sinppet
export const finOneSnippet = async (req, res) => {
  let snippets;
  let id = req.params.id;
  try {
    const response = await axios.get("http://localhost:5000/snippets");
    snippets = await response.data;
  } catch (error) {
    snippets = [];
  }
  res.render("index", { snippets: snippets, snippet: snippets[id] });
};

//create snippet

export function create(req, res) {
  const snippetInfo = req.body; //get the parsed information

  if (!snippetInfo.title || !snippetInfo.description || !snippetInfo.language) {
    res.render("show_message", {
      message: "Please fill in all fields",
      type: "error",
    });
  } else {
    const newSnippet = new Snippet({
      title: snippetInfo.title,
      description: snippetInfo.description,
      language: snippetInfo.language,
    });
    newSnippet.save((err, response) => {
      if (err) {
        res.render("show_message", {
          message: "Error saving snippet to db",
          type: "error",
        });
      } else {
        //res.redirect("/snippet");
        res.render("show_message", {
          message: "New snippet added",
          type: "success",
          snippet: response,
        });
      }
    });
  }
}

//Get All snippet

export async function getAll(req, res) {
  try {
    const snipptes = await Snippet.find();

    //res.render("AllSnippets", {});
    res.send(snipptes);
  } catch (error) {
    console.log(error);
  }
}

//Get Snippet by Id
export async function getSnippetsById(req, res) {
  try {
    const snippet = await Snippet.findById(req.params.id);

    res.send(snippet);
  } catch (error) {
    console.log(error);
  }
}

//update snippets
export const updateSnippets = (req, res) => {
  const snippets = req.body;
  if (!snippets.title || !snippets.description || !snippets.language) {
    res.render("show_message", {
      message: "Please fill all fields",
      type: "error",
    });
  } else {
    Snippet.findByIdAndUpdate(
      req.params.id,
      {
        title: snippets.title,
        description: snippets.description,
        language: snippets.language,
      },

      (err, response) => {
        if (err) {
          res.render("show_message", {
            message: "Snippet Updates Error",
            type: "error",
          });
        } else {
          res.render("show_message", {
            message: "Snippet Updates",
            type: "success",
            snippet: response,
          });
        }
      }
    );
  }
};
