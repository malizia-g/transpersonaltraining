// Whether the school is taking applications. While `open` is false:
//   - every "Apply" button on the site is shown greyed out, not linked
//   - every "see how to apply" text link says when applications open instead
//   - /apply/ keeps its page but disables the form, and leaves out the
//     enrolment agreement and the upload step entirely — the agreement Doc is
//     still a draft, and the page is where it would otherwise be published
//
// Set `open` to true to put everything back as it was.

module.exports = {
    open: false,
    notice: 'Applications open in 2027'
};
