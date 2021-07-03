#!/usr/bin/env -S perl -I .
=begin comment

  Copyright (c) 2021, Oliver Merkel.
  Please see the AUTHORS file for details.
  All rights reserved.

  Use of this code is governed by a
  MIT license that can be found in the LICENSE file.

=end comment
=cut

use strict;
use warnings;
use Hangman;

my $h = Hangman->new();
$h->run;
