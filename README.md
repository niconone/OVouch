# OVouch

## Explanation

A network of people:

    ------------------
    |  g       d     |
    |    a           |
    |       e   b    |
    |   c          f |
    ------------------

Your network of trusted people. These are the subset that you know really well and trust their recommendations:

    ------------------
    |         d      |
    |    a           |
    |          b     |
    |                |
    ------------------

You set a minimum number of vouches that are required from your trusted network.

    vouchMin = 1

Trusted network member `a` vouches for member `g`. Since you have a vouchMin of 1, this means `g` will be in your vouched network.

    ------------------
    |       g        |
    |                |
    ------------------

If `a` unvouches for `g`, they will be removed from your vouched network, unless you have moved them into your trusted network.

## Use case

Let's say you have a profile and posts online but you want restricted access. If someone is not in your trusted or vouched networks, they will see nothing.

If someone is in your vouched network, they only see your profile summary.

If someone is in your trusted network, they see your detailed profile information such as personal contact data, your posts, etc.

## Usage

Check the test file for examples.

## Tests

    npm test

## License

BSD-3-Clause
